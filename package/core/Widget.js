import CMSWidgetFieldgroup from '../widgets/CMSWidgetFieldgroup.svelte';
import CMSWidgetMultiple from '../widgets/CMSWidgetMultiple.svelte';
import CMSWidgetNumber from '../widgets/CMSWidgetNumber.svelte';
import CMSWidgetRange from '../widgets/CMSWidgetRange.svelte';
import CMSWidgetText from '../widgets/CMSWidgetText.svelte';
import CMSWidgetUndefined from '../widgets/CMSWidgetUndefined.svelte';
import CMSWidgetDate from '../widgets/CMSWidgetDate.svelte';
import CMSWidgetTextarea from '../widgets/CMSWidgetTextarea.svelte';
import CMSWidgetCheckbox from '../widgets/CMSWidgetCheckbox.svelte';
import CMSWidgetImage from '../widgets/CMSWidgetImage.svelte';
import CMSWidgetFile from '../widgets/CMSWidgetFile.svelte';
import CMSWidgetSelect from '../widgets/CMSWidgetSelect.svelte';
import CMSWidgetValue from "../widgets/CMSWidgetValue.svelte";
import CMSWidgetReference from "../widgets/CMSWidgetReference.svelte";
import CMSWidgetMultiselect from "../widgets/CMSWidgetMultiselect.svelte";
import CMSWidgetOptions from "../widgets/CMSWidgetOptions.svelte";
import SlugConfig from "./Slug";
import { isReferenceString } from "../utils";
export const templateWidget = {
    id: 'widget',
    label: 'Widget',
    labelPlural: 'Widgets',
    description: `Widgets provide form inputs for entering data into fields.`,
    typeField: true,
    typeInherits: true,
    typeRequired: true,
    typeRestricted: true,
    isConfigurable: true,
};
export class Widget {
    constructor(conf, cms) {
        // TODO: change per CMSContentField changes
        conf = typeof conf === 'string' ? { type: conf } : conf;
        let parent = cms.widgets[conf.type];
        parent = typeof parent === 'string' ? { type: parent } : parent;
        // @ts-ignore TODO: figure out how to specify that mergeConfigOptions returns the same type as the parameter
        if (parent)
            conf = cms.mergeConfigOptions(parent, conf, { type: parent.type });
        let widgetType = cms.widgetTypes[conf['type']];
        this.type = widgetType?.id;
        this.widget = widgetType?.widget;
        this.handlesMultiple = widgetType?.handlesMultiple || false;
        this.handlesMedia = widgetType?.handlesMedia || false;
        this.handlesFields = widgetType?.handlesFields || false;
        if (widgetType?.formDataHandler) { // formDataHandler can only be set on the widget type
            this.formDataHandler = widgetType.formDataHandler;
        }
        this.options = (widgetType?.optionFields) ? cms.getInstanceOptions(widgetType, conf) : {};
    }
}
export const widgetTypes = {
    undefined: {
        id: 'undefined',
        description: `The Widget that shows up when SvelteCMS can't find the proper Widget.`,
        fieldTypes: [],
        widget: CMSWidgetUndefined,
        admin: true,
    },
    multiple: {
        id: 'multiple',
        description: `The Widget for fields that allow multiple values.`,
        fieldTypes: [],
        widget: CMSWidgetMultiple,
        admin: true,
    },
    text: {
        id: 'text',
        description: `A plain text input.`,
        fieldTypes: ['text', 'date', 'number'],
        widget: CMSWidgetText,
        optionFields: {
            placeholder: {
                type: 'text',
                default: '',
                scriptable: true,
                helptext: 'This text will be displayed when the field is empty.',
            }
        }
    },
    fieldgroup: {
        id: 'fieldgroup',
        description: `The Widget for fieldgroups with nested fields.`,
        fieldTypes: ['fieldgroup'],
        handlesFields: true,
        widget: CMSWidgetFieldgroup,
        optionFields: {
            useComponents: {
                type: 'boolean',
                default: false,
                helptext: 'Allow users to choose a Fieldgroup Component when editing.'
                    + 'For component-driven content, choose this option and set field.multiple.',
            },
            fieldgroupTags: {
                type: 'text',
                multiple: true,
                default: [],
                hidden: '$not($values.useComponents)',
                helptext: 'Allow the specified fieldgroup formats to be chosen by the editors. ' +
                    'To allow only specific fieldgroups, set this field blank.',
                widget: {
                    type: 'options',
                    items: ['fullwidth', 'block', 'inline'],
                    oneline: true,
                }
            },
            fieldgroups: {
                type: 'text',
                multiple: true,
                default: [],
                hidden: '$not($values.useComponents)',
                helptext: 'Allow the specified fieldgroups to be chosen by the editors.',
                widget: {
                    type: 'multiselect',
                    items: {
                        function: 'listEntities',
                        params: ['fieldgroups'],
                    },
                    restrictToItems: true,
                }
            },
            oneline: {
                type: 'boolean',
                default: false,
                disabled: '$values.useComponents',
                helptext: 'add the "oneline" class to a fieldgroup fieldset',
            },
        }
    },
    number: {
        id: 'number',
        fieldTypes: ['number', 'text'],
        description: 'An HTML number input.',
        widget: CMSWidgetNumber,
        optionFields: {
            min: {
                type: 'number',
                default: 0,
                scriptable: true,
                helptext: 'The minimum number allowed on the form. Does not validate form submissions!',
            },
            max: {
                type: 'number',
                default: undefined,
                scriptable: true,
                helptext: 'The maximum number allowed on the form. Does not validate form submissions!',
            },
            step: {
                type: 'number',
                default: 1,
                scriptable: true,
                helptext: 'The amount between each selectable value, e.g. "2" would allow 0,2,4,6.... Does not validate form submissions!',
            },
        }
    },
    range: {
        id: 'range',
        fieldTypes: ['number', 'text'],
        description: `An HTML range input with a slider.`,
        widget: CMSWidgetRange,
        optionFields: {
            min: {
                type: 'number',
                default: 0,
                scriptable: true,
                helptext: 'The minimum number allowed on the form. Does not validate form submissions!',
            },
            max: {
                type: 'number',
                default: 5,
                scriptable: true,
                helptext: 'The maximum number allowed on the form. Does not validate form submissions!',
            },
            step: {
                type: 'number',
                default: 1,
                scriptable: true,
                helptext: 'The amount between each selectable value, e.g. "2" would allow 0,2,4,6.... Does not validate form submissions!',
            },
            showValue: {
                type: 'boolean',
                default: true,
                scriptable: true,
                helptext: 'Whether to show the exact value while editing.',
            },
            showScale: {
                type: 'boolean',
                default: true,
                scriptable: true,
                helptext: 'Whether to show min and max values when editing.',
            },
            items: {
                type: 'list',
                label: 'Context Items',
                default: [],
                scriptable: true,
                helptext: `Text values that correspond to a certain value or range of values, ` +
                    `similar to value:label items for a select input. ` +
                    `The list must be keyed with numbers, e.g. "0:low", "3:medium", "8:high".`,
            },
        }
    },
    date: {
        id: 'date',
        fieldTypes: ['text', 'date'],
        description: `An HTML date input, with options for whether and how to store the time.`,
        widget: CMSWidgetDate,
        optionFields: {
            time: {
                type: 'text',
                default: '',
                scriptable: true,
                helptext: `Whether and how to store the time. Choosing "none" will store only the date
        as yyyy-mm-dd; which is useful when using the date widget with a text field, or as a slug,
        but not useful for saving dates. "Time only" is similar, but stores only a time in hours
        and minutes. Either of the other two will store a full UTC date, including time.
        Sometimes it may be best to hide the time input, e.g. if you are interested only in
        when a piece of content is posted and would like to simplify the form.`,
                widget: {
                    type: 'select',
                    default: 'editable',
                    unset: '- none - ',
                    items: [
                        'hidden:Hidden',
                        'editable:Editable',
                        'timeonly:Time only (no date)',
                    ],
                }
            },
            minDate: {
                type: 'date',
                widget: {
                    type: 'date',
                    time: '',
                },
                default: '',
                scriptable: true,
                helptext: 'The earliest date allowable.',
                hidden: '$equal($values.time,timeonly)',
            },
            maxDate: {
                type: 'date',
                widget: {
                    type: 'date',
                    time: '',
                },
                default: '',
                scriptable: true,
                helptext: 'The latest date allowable.',
                hidden: '$equal($values.time,timeonly)',
            },
            seconds: {
                type: 'boolean',
                default: false,
                scriptable: true,
                label: 'Use seconds',
                helptext: 'Whether to store and keep seconds in the time.',
                hidden: '$not($values.time)'
            },
            minTime: {
                type: 'date',
                widget: {
                    type: 'date',
                    time: 'timeonly',
                    seconds: '$if($values.seconds)'
                },
                default: '',
                scriptable: true,
                helptext: 'The earliest time allowed.',
                hidden: '$not($values.time)'
            },
            maxTime: {
                type: 'date',
                widget: {
                    type: 'date',
                    time: 'timeonly',
                    seconds: '$values.seconds',
                },
                default: '',
                scriptable: true,
                helptext: 'The latest time allowed.',
                hidden: '$not($values.time)'
            },
        },
    },
    textarea: {
        id: 'textarea',
        fieldTypes: ['html', 'text'],
        description: `An HTML textarea input.`,
        widget: CMSWidgetTextarea,
        optionFields: {
            placeholder: {
                type: 'text',
                default: '',
                scriptable: true,
                helptext: 'This text will be displayed when the field is empty.',
            },
            rows: {
                type: 'number',
                default: 3,
                scriptable: true,
                helptext: 'The height, in "rows", of the textarea element.',
            },
            cols: {
                type: 'number',
                default: 20,
                scriptable: true,
                helptext: 'The width, in "columns", of the textarea element.',
            },
            resize: {
                type: 'text',
                helptext: 'Whether to allow resizing of the textarea element.',
                default: 'none',
                scriptable: true,
                widget: {
                    type: 'select',
                    options: {
                        // @ts-ignore
                        items: ['none', 'both', 'horizontal', 'vertical']
                    }
                }
            },
            autosize: {
                type: 'boolean',
                default: false,
                scriptable: true,
                helptext: 'If selected, the textarea element will be automatically resized to accommodate the entered text.'
            },
        }
    },
    checkbox: {
        id: 'checkbox',
        fieldTypes: ['boolean'],
        description: `An HTML checkbox form element.`,
        widget: CMSWidgetCheckbox,
        optionFields: {
            labelBeforeCheckbox: {
                type: 'boolean',
                default: false,
                scriptable: true,
                helptext: 'Render the text label before the checkbox element in HTML markup.',
            }
        }
    },
    image: {
        id: 'image',
        fieldTypes: ['image'],
        description: `The default SvelteCMS image input. Handles multiple images with alt and title fields, but no drag and drop.`,
        widget: CMSWidgetImage,
        handlesMultiple: true,
        handlesMedia: true,
        formDataHandler: async (value, cms, contentType, field) => {
            let files = value.files;
            let data = [];
            Object.entries(value).forEach(([i, obj]) => {
                if (i.match(/^\d+$/)) {
                    data.push(obj);
                }
            });
            const promises = data.map(async (item) => {
                if (item?.filename?.[0]) {
                    let file = files.find(f => f.name === item.filename[0]);
                    if (file) {
                        item.src = [await field.mediaStore.saveMedia(file, field.mediaStore.options)];
                    }
                }
                delete (item.filename);
                item.src = item.src[0];
                item.alt = item?.alt?.[0] ? item.alt[0] : undefined;
                item.title = (item?.title?.[0]) ? item.title[0] : undefined;
                item.attribution = (item?.attribution?.[0]) ? item.attribution[0] : undefined;
                return item;
            });
            const result = await Promise.all(promises);
            return result;
        },
        optionFields: {
            accept: {
                type: 'text',
                multiple: true,
                default: 'image/*',
                widget: {
                    type: 'multiselect',
                    allowBlur: true,
                },
                helptext: 'A list of unique file type specifiers, e.g. "image/jpeg" or ".jpg".',
            },
            altField: {
                type: 'boolean',
                default: true,
                helptext: 'Show a field for the "alt" attribute'
            },
            altRequired: {
                type: 'boolean',
                default: false,
                helptext: 'Require "alt" attribute'
            },
            titleField: {
                type: 'boolean',
                default: false,
                helptext: 'Show a field for the "title" attribute'
            },
            attributionField: {
                type: 'boolean',
                default: false,
                helptext: 'Show a field for license or attribution of the image'
            },
            attributionRequired: {
                type: 'boolean',
                default: false,
                helptext: 'Require the attribution field',
            },
        },
    },
    file: {
        id: 'file',
        fieldTypes: ['image', 'file'],
        description: `The default cms file input. Handles multiple files.`,
        widget: CMSWidgetFile,
        handlesMultiple: true,
        handlesMedia: true,
        optionFields: {
            accept: {
                type: 'text',
                default: undefined,
                widget: 'multiselect',
                helptext: 'A list of unique file type specifiers, e.g. "image/jpeg" or ".jpg".',
            },
            storeStats: {
                type: 'boolean',
                default: undefined,
                helptext: 'Store type, size, and upload date for each file in the database.'
            },
            titleField: {
                type: 'boolean',
                default: false,
                helptext: 'Show a field for the "title" attribute'
            },
            attributionField: {
                type: 'boolean',
                default: false,
                helptext: 'Show a field for license or attribution of the image'
            },
            attributionRequired: {
                type: 'boolean',
                default: false,
                helptext: 'Require the attribution field',
            },
            hideHeader: {
                type: 'boolean',
                default: false,
                helptext: 'Hide the header for the table of files'
            },
        }
    },
    select: {
        id: 'select',
        fieldTypes: ['text', 'number', 'float', 'date'],
        description: `An HTML select box.`,
        widget: CMSWidgetSelect,
        handlesMultiple: true,
        optionFields: {
            size: {
                type: 'number',
                widget: 'text',
                default: 0,
                scriptable: true,
                helptext: 'The maximum number of items shown in the dropdown area of a select box.'
            },
            unset: {
                type: 'text',
                default: '',
                scriptable: true,
                helptext: 'The title text to use for a blank entry. If this is provided, or if the field is not ' +
                    'required, a blank value will be available. The default title for the blank value is "- none -".',
            },
            items: {
                type: 'list',
                default: [],
                scriptable: true,
                helptext: 'The list of values allowed for this select input, along with the labels for display.',
            },
        }
    },
    options: {
        id: 'options',
        fieldTypes: ['text', 'number', 'float', 'date'],
        description: 'Options presented as option buttons or checkboxes.',
        widget: CMSWidgetOptions,
        handlesMultiple: true,
        optionFields: {
            items: {
                type: 'list',
                default: [],
                scriptable: true,
                helptext: 'The list of values allowed for this options field, along with the labels for display.',
            }
        }
    },
    value: {
        id: 'value',
        description: 'This widget allows providing a calculated value using a Script Function. ' +
            'The value may be hidden or displayed during editing. THIS WIDGET DOES NOT PROVIDE SECURITY! ' +
            'Even if not displayed, this field and its value are still available in clients / browsers, ' +
            'and the value can still be modified before the form is submitted. NEVER expect this widget ' +
            'to keep sensitive data safe, and NEVER trust the data received from it without validating it.',
        fieldTypes: ['text', 'date', 'html', 'fieldgroup', 'number', 'float', 'boolean', 'value'],
        widget: CMSWidgetValue,
        optionFields: {
            value: {
                type: 'text',
                default: '',
                scriptable: true,
                helptext: 'The value of the field. Use a Script Function to determine this based on other fields.',
            },
            display: {
                type: 'boolean',
                default: false,
                scriptable: true,
                helptext: 'Can display the calculated value on the editing form in a disabled text field.',
            }
        }
    },
    reference: {
        id: 'reference',
        description: 'A reference to another Content item.',
        fieldTypes: ['reference', 'text'],
        handlesMultiple: true,
        widget: CMSWidgetReference,
        formDataHandler: async (value, cms, contentType, field) => {
            if (Array.isArray(value) && value.length) {
                // Get all content types available for referencing, as an array of strings
                let contentTypes = Array.isArray(field.widget?.options?.contentTypes)
                    ? field.widget.options.contentTypes.filter(Boolean).map(toString)
                    : (field.widget?.options?.contentTypes ? [field.widget.options.contentTypes.toString()] : []);
                if (!contentTypes.length)
                    contentTypes = cms.listEntities('contentType');
                let index = await cms.listContent(contentTypes);
                let slugConfig = new SlugConfig(field.widget?.options?.displayKey?.toString(), cms);
                return value.map(v => {
                    // If the value is an existing reference, as `${_type}/${_slug}`, return the IndexItem
                    // This will automatically filter out any items not from an allowed Content Type
                    if (isReferenceString(v)) {
                        let [type, slug] = v.split('/');
                        let item = index.find(item => item._slug === slug && item._type === type);
                        return { ...item, [field.widget?.options?.referenceKey?.toString()]: undefined };
                    }
                    // For free tagging values (which should be strings) create a new IndexItem
                    let displayKey = field.widget?.options?.displayKey?.toString();
                    if (contentTypes.length === 1
                        && field.widget?.options?.freeTagging
                        && field.widget?.options?.displayKey) {
                        return {
                            _type: contentTypes[0],
                            _slug: cms.getSlug({ [displayKey]: v }, slugConfig, true),
                            [displayKey]: v
                        };
                    }
                }).filter(Boolean);
            }
        },
        optionFields: {
            contentTypes: {
                type: 'text',
                label: 'Index ID / Content Types',
                multiple: true,
                multipleOrSingle: true,
                default: undefined,
                helptext: `An ID for the field's index, or one or more Content Type IDs. ` +
                    `For free tagging, this MUST be a single value, which MAY have an associated Content Type.`,
                widget: {
                    type: 'multiselect',
                    minChars: 0,
                    items: { function: 'listEntities', params: ['contentType'] },
                    allowBlur: true,
                },
            },
            freeTagging: {
                type: 'boolean',
                default: false,
                helptext: 'If false, only existing content items will be allowed.',
                disabled: { function: 'not', params: [
                        { function: 'typeof', params: [
                                { function: 'getValue', params: ['contentTypes'] },
                                'string',
                            ] }
                    ] }
            },
            displayKey: {
                label: 'Index Field',
                type: 'text',
                required: true,
                default: 'title',
                multiple: false,
                helptext: 'The field used for search and display on form inputs, and for storing the display value for free tagging.'
                    + ' If this field is linked with Content Types, then each linked Content Type should have an indexed field with this ID.'
                    + ' For free tagging, or when not linked to a Content Type, you can use any generic Field that is both indexed and required.',
                widget: {
                    type: 'multiselect',
                    items: { function: 'slugFields', params: [
                            { function: 'getValue', params: [
                                    { function: 'if', params: [
                                            { function: 'typeof', params: [
                                                    { function: 'getValue', params: ['contentTypes'] },
                                                    'string',
                                                ] },
                                            'contentTypes',
                                            'contentTypes.0'
                                        ] }
                                ] }
                        ] },
                    restrictToItems: true,
                    allowBlur: true,
                }
            },
            referenceKey: {
                label: 'Reverse Reference Field',
                type: 'text',
                default: 'referencedContent',
                helptext: 'The ID of a "reference" type field on the associated Content Type(s). ' +
                    'If provided, that field in referenced content will be populated with references back to this content.',
            },
            displayMode: {
                type: 'text',
                default: 'reference',
                widget: {
                    type: 'multiselect',
                    items: ['page', 'teaser', 'reference'],
                    minChars: 0,
                },
                helptext: 'The displayMode to use when displaying referenced content.'
            },
            // TODO: in order to carry this off, we would need to:
            // - Differentiate between slugs and free tags in formDataHandler above
            // - Same in CMSWidgetReference, when getting tags variable from values
            // - Account for slug-only values in the "references" hook (Hook.ts)
            // - Load content from slug-only values in Reference display component
            // slugOnly: {
            //   type: 'boolean',
            //   default: false,
            //   helptext: 'EXPERIMENTAL. Select this option if you want this field to store only the _slug string. '+
            //     'By default, reference fields store all index fields and the _slug for each referenced item, '+
            //     'which is often desirable for NoSQL or flat files as it reduces data calls.'
            // },
            placeholder: {
                type: 'text',
                default: '',
                scriptable: true,
                helptext: 'Placeholder text when the input is empty.',
            },
            allowBlur: {
                type: 'boolean',
                default: false,
                helptext: 'Enable adding an unfinished item when the input loses focus.',
            },
            minChars: {
                type: 'number',
                default: 1,
                helptext: 'The number of characters that must be typed before options are shown.',
            },
        }
    },
    multiselect: {
        id: 'multiselect',
        description: 'Multiple text-entry widget provided by svelte-input-tags.',
        fieldTypes: ['text', 'number', 'float'],
        handlesMultiple: true,
        widget: CMSWidgetMultiselect,
        optionFields: {
            items: {
                type: 'text',
                multiple: true,
                default: [],
                widget: 'multiselect',
                scriptable: true,
                helptext: `A list of possible values to be presented to content editors. ` +
                    `Values should be text strings, but may use the "[value][:label]" format, ` +
                    `e.g. "1:First Place". ` +
                    `A script function may be used to retrieve options from an external API.`,
            },
            restrictToItems: {
                type: 'boolean',
                default: false,
                scriptable: true,
                helptext: 'Only accept items from the provided items.',
            },
            itemsFilter: {
                type: 'boolean',
                default: true,
                scriptable: true,
                helptext: 'Turn this off to disable filtering the items. May be useful for some APIs.',
            },
            placeholder: {
                type: 'text',
                default: '',
                scriptable: true,
                helptext: 'Placeholder text when the input is empty.',
            },
            onlyUnique: {
                type: 'boolean',
                default: true,
                scriptable: true,
                helptext: 'Ensure that all entered items are unique.',
            },
            allowBlur: {
                type: 'boolean',
                default: false,
                helptext: 'Enable adding an unfinished item when the input loses focus.',
            },
            minChars: {
                type: 'number',
                default: 1,
                helptext: 'The number of characters that must be typed before options are shown.',
            },
            allowPaste: {
                type: 'boolean',
                default: false,
                helptext: 'Enable pasting a tag or tag group.',
            },
            allowDrop: {
                type: 'boolean',
                default: false,
                helptext: 'Enable drag and drop of a tag or tag group.',
            },
            splitWith: {
                type: 'text',
                default: ',',
                scriptable: true,
                helptext: 'The character that splits a group of items.',
                hidden: { function: 'not', params: [
                        { function: 'or', params: [
                                { function: 'getValue', params: ['allowPaste'] },
                                { function: 'getValue', params: ['allowDrop'] },
                            ] }
                    ] },
            },
        }
    },
    // {
    //   id: 'options', // i.e. radios or checkboxes
    //   fieldTypes: 'text,number,date',
    //   handlesMultiple: true,
    // },
};
export default Widget;
