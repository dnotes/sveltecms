import { cloneDeep, get, isEqual, set } from "lodash-es";
import { isIndexItem } from "./Indexer";
import { findReferenceIndex } from "../utils";
export const templateHook = {
    id: 'hook',
    label: 'Hook',
    labelPlural: 'Hooks',
    description: 'A Hook is a function provided by a Plugin that executes at a certain point in the content life cycle.',
    typeField: true,
    typeInherits: false,
};
export class Changeset {
    constructor(contentType) {
        this.before = [];
        this.after = [];
        this.contentType = contentType;
    }
    push(before, after) {
        this.before.push(before ? cloneDeep(before) : undefined);
        this.after.push(after ? cloneDeep(after) : undefined);
    }
}
// TODO: Make a special kind of Error for Hooks, including:
// - some way to collect multiple errors into one
// - some way to indicate a URL to check on each error
export const hooks = [
    {
        type: 'contentPostWriteAll',
        label: 'Index Media',
        description: 'Indexes Media when content is saved.',
        fn: async (changeset, cms, options) => {
            cms.indexer.indexMedia(changeset, cms, options);
        }
    },
    {
        type: 'contentPostWrite',
        label: 'References',
        description: 'Saves changes to any reference fields that are reverse linked.',
        fn: async (change, cms) => {
            // Get a list of all fields to be checked
            // The recursive function searches through the fields property for all
            // reference fields that have a widget with the "linkedField" option set
            // The array is the field's id (or path) in the content being saved,
            // and the id (or path) of the linked Field in the referenced content type
            let referenceFields = cms.findFields(change.contentType.fields, { type: 'reference' })
                .map(fieldPath => {
                let referenceKey = get(change.contentType.fields, fieldPath).widget?.options?.referenceKey;
                return [fieldPath, typeof referenceKey === 'string' ? referenceKey : ''];
            });
            if (!referenceFields.length)
                return;
            // Set array for errors
            let errors = [];
            // 1. Determine if the index object for this content has changed
            // 2. Make a list of all referenced items of content
            // 3. If the reference is not newly added,
            //    and the index object has NOT changed
            //    or if the linked Field uses slugOnly and the slug has not changed,
            //    filter out referenced content whose back reference hasn't changed
            // 4. Separate the list by Content Type
            // 5. Load content for each referenced item (can do this async)
            // 6. Update any linked Field value with the new item, or delete the old item
            // 7. Save the content for each ContentType, saving the index but skipping the hooks
            // 1. Get the appropriate references for the item being saved
            let oldIndexItem = cms.getIndexItem(change?.before);
            let newIndexItem = cms.getIndexItem(change?.after);
            let isChangedContentIndexItem = !isEqual(oldIndexItem, newIndexItem);
            // let oldSlug = change.before?._slug ? `${change?.before?._type}/${change?.before?._slug}` : undefined
            // let newSlug = change.after?._slug ? `${change?.after?._type}/${change?.after?._slug}` : undefined
            // let isChangedSlug = oldSlug === newSlug
            // 4. prepare an object keyed by content type ID, i.e. { contentTypeID: {} }
            let allContent = {};
            cms.listEntities('contentType').forEach(k => { allContent[k] = {}; });
            // iterating through each of the reference fields on the content being saved
            // this must be done synchronously because there may be multiple fields referencing
            // the same type of content and we must not load any piece of content multiple times
            for (let i = 0; i < referenceFields.length; i++) {
                let [fieldPath, referenceKey] = referenceFields[i];
                let field = get(change.contentType.fields, fieldPath);
                // Get a list of all allowable values for each reference's _type property
                let referencedContentTypes = Array.isArray(field.widget?.options?.contentTypes)
                    ? field.widget.options.contentTypes.filter(Boolean).map(toString)
                    : (field.widget?.options?.contentTypes ? [field.widget.options.contentTypes.toString()] : []);
                if (!referencedContentTypes.length)
                    referencedContentTypes = cms.listEntities('contentType');
                // Create variable for index changes
                let indexChanges = {};
                referencedContentTypes.forEach(k => indexChanges[k] = []);
                try {
                    // Get field values for the field
                    let oldValues = get(change.before || {}, fieldPath) ?? [];
                    let oldValueArray = (Array.isArray(oldValues) ? oldValues : [oldValues].filter(Boolean)).filter(isIndexItem);
                    let newValues = get(change.after || {}, fieldPath) ?? [];
                    let newValueArray = (Array.isArray(newValues) ? newValues : [newValues].filter(Boolean)).filter(isIndexItem);
                    // ==== DELETED ITEMS =====================
                    // Change references that have been deleted
                    let deleteRefs = oldValueArray
                        // Filter out any old references that are still in, considering ONLY _type and _slug.
                        .filter(item => findReferenceIndex(item, newValueArray) === -1)
                        .map(async (item) => {
                        // Get content loading variables
                        let { _slug, _type } = item;
                        // Load content (or index item) if possible
                        let before = allContent?.[_type]?.[_slug] || await cms.getContent(_type, _slug, { getRaw: true });
                        // If content was loaded, delete the reference if necessary
                        if (before) {
                            let after = cloneDeep(before);
                            let fieldValue = get(after, referenceKey);
                            if (!fieldValue)
                                return; // don't need to delete the reference
                            if (!Array.isArray(fieldValue)) { // could be a !multiple reference field
                                if (fieldValue?.['_type'] === oldIndexItem._type && fieldValue?.['_slug'] === oldIndexItem._slug) {
                                    // Set the value in the other Content|IndexItem
                                    set(after, referenceKey, undefined);
                                    // Queue the changes to be made
                                    if (allContent[_type])
                                        allContent[_type][_slug] = after;
                                    else if (indexChanges[_type])
                                        indexChanges[_type].push({ before, after });
                                }
                            }
                            else {
                                let idx = findReferenceIndex(oldIndexItem, fieldValue);
                                if (idx !== -1) {
                                    // Get the Content Type, if it's available
                                    let contentType = cms.contentTypes[_type];
                                    let referenceField = get(contentType?.fields || {}, referenceKey);
                                    // Set the value in the other Content|IndexItem
                                    fieldValue.splice(idx, 1);
                                    if (!fieldValue.length)
                                        set(after, referenceKey, undefined);
                                    else if (fieldValue.length === 1 && referenceField && referenceField.multipleOrSingle)
                                        set(after, referenceKey, fieldValue[0]);
                                    else
                                        set(after, referenceKey, fieldValue);
                                    // Queue the changes to be made
                                    if (allContent[_type])
                                        allContent[_type][_slug] = after;
                                    else if (indexChanges[_type])
                                        indexChanges[_type].push({ before, after });
                                }
                            }
                        }
                        // If the content could not be loaded, then there is no need to delete anything.
                        // (strange though -- TODO: should this be an error?)
                    });
                    // ---- end deleted items
                    // ==== UPDATED ITEMS ==============================
                    // Change references that have been added or updated
                    let updateRefs = newValueArray
                        .map(async (item) => {
                        // Get content loading variables
                        let { _slug, _type } = item;
                        // Filter out any items from Content Types that aren't permitted
                        // If someone tries to add new items, they won't be saved.
                        // TODO: figure out what to do if people change configuration after content exists
                        if (!referencedContentTypes.includes(_type))
                            return;
                        // Get the Content Type, if it's available
                        let contentType = cms.contentTypes[_type];
                        let referenceField = get(contentType?.fields || {}, referenceKey);
                        // 3. Check whether we can and need to update a reference
                        // If the IndexItem for Content being saved has not changed,
                        // and the reference is still in the field item, then there is nothing to update.
                        if (!isChangedContentIndexItem && findReferenceIndex(item, oldValueArray) !== -1)
                            return;
                        // Load content (or index item) if possible
                        let before = allContent?.[_type]?.[_slug] || await cms.getContent(_type, _slug, { getRaw: true });
                        let after = before ? cloneDeep(before) : undefined;
                        if (!after) {
                            if (referencedContentTypes.length !== 1 || !field.widget?.options?.freeTagging)
                                return;
                            after = cms.newContent(item?._type, item) || cloneDeep(item);
                        }
                        let fieldValue = get(before || {}, referenceKey);
                        // The new fieldValue should be an IndexItem[] array
                        // -- unless the referenceField is !multiple or multipleOrSingle, and there is only one item.
                        // If there is no fieldValue, we need to create one.
                        if (!fieldValue) {
                            set(after, referenceKey, (referenceField && (!referenceField?.multiple || referenceField?.multipleOrSingle) ? newIndexItem : [newIndexItem]));
                        }
                        // If it's not an array, add the item if allowed. Items get added at the top.
                        else if (!Array.isArray(fieldValue)) {
                            if (!referenceField || (referenceField?.multiple && referenceField?.multipleMax > 1))
                                set(after, referenceKey, [newIndexItem, fieldValue]);
                        }
                        // Add the item
                        else if (Array.isArray(fieldValue)) { // It's always an array by now, but typescript complains
                            // Check if the item is changed or added
                            let idx = findReferenceIndex(oldIndexItem, fieldValue);
                            if (idx !== -1)
                                fieldValue.splice(idx, 1, newIndexItem);
                            else
                                fieldValue.unshift(newIndexItem);
                            set(after, referenceKey, fieldValue);
                        }
                        // Queue the changes to be made
                        if (allContent[_type])
                            allContent[_type][_slug] = after;
                        else if (indexChanges[_type])
                            indexChanges[_type].push({ before, after });
                    });
                    // ---- end updated items
                    await Promise.all([...deleteRefs, ...updateRefs]);
                    let promises;
                    // 7. Save the indexes for any tags without a linked Content Type
                    promises = Object.keys(indexChanges).map(async (id) => {
                        if (indexChanges[id].length)
                            await cms.indexer.updateIndex(id, indexChanges[id]);
                    });
                    await Promise.all(promises);
                }
                catch (e) {
                    errors.push(e);
                }
            }
            // DONE iterating through fields.
            try {
                let promises;
                // 7. Save the content for each ContentType, saving the index but skipping the hooks
                promises = Object.keys(allContent).map(async (contentTypeID) => {
                    let content = Object.values(allContent[contentTypeID]);
                    if (content.length)
                        await cms.saveContent(contentTypeID, content, { skipHooks: true });
                });
                await Promise.all(promises);
            }
            catch (e) {
                errors.push(e);
            }
            if (errors.length)
                throw new Error(errors.map(e => `Reference linking: ${e.message}\n${e.stack || ''}\n\n`).join('\n'));
        }
    }
];
