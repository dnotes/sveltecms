---
title: References, Tagging, and Hooks, Oh My!
date: 2022-08-05T18:01:00.000Z
image:
  src: /images/Screen Shot 2022-08-05 at 5.28.23 PM.png
  alt: Configuration screen for a reference field in Svelte CMS
tags:
  - title: Tagging
    _slug: tagging
    _type: tags
  - title: Indexers
    _type: tags
    _slug: indexers
  - title: Reference Fields
    _type: tags
    _slug: reference-fields
_slug: 2022-08-05-references-tagging-and-hooks-oh-my
_oldSlug: 2022-08-05-references-tagging-and-hooks-oh-my
_type: blog
---
Tagging and maintaining references between content items is one of the most important functions of any modern CMS, and I’ve spent the last week implementing tagging and content referencing functionality for SvelteCMS.

## New "reference" Field Type

There is a new field type in SvelteCMS, `type: reference`, which facilitates linking between different items of content in SvelteCMS. The content items don't have to share fields or even databases---in fact, for use cases like tagging, the tag content doesn't need an associated Content Type, as the reference data may be stored directly in an Index file.

## Configuration

SvelteCMS will be shipping with two default reference fields designed to facilitate free tagging:

1. The first is the `tags` field that should be used on Content Types for which you want to have a free tagging widget.

2. The second is the `taggedContent` field that should be used on the *(optional!)* Content Type that is used to store tags.

## Basic tagging

 To enable tagging for any Content Type, you can add the following config to its definition:

```
...
fields:
  ...
  tags: tags
```

You will see that the entry form for that content type will have a tagging field, and those tags will be displayed as links when the content type is displayed in `page` mode. If you tag a piece of content with the phrase "Some Tag", that tag will be created in an Index, and you will be able to visit `/tags/some-tag` to see a list of tagged content, as well as `/tags` to see a list of all tags.

## Creating a Content Type for tags

If you want to fill out your tag pages with some content, you can create a Content Type named `tags`:

```
contentTypes:
  tags:
    fields:
      title: title
      body: markdown
      taggedContent: taggedContent
    slug: title
```

This setup should work as long as the `tags` and `taggedContent` fields are used as provided by SvelteCMS.

## Advanced use: Different types of tags, etc.

For advanced use, it's necessary to understand how `reference` fields relate to one another. The crucial properties are `contentTypes`, `displayKey`, and `referenceKey`. The helptext in the widget configuration screen should explain things, but you can also check out the configuration for the two default `reference` fields:

```
  tags:
    type: reference
    widget:
      type: reference
      contentTypes: tags
      freeTagging: true
      referenceKey: taggedContent
  taggedContent:
    type: reference
    widget:
      type: reference
      referenceKey: tags
      displayMode: teaser
```

The important keys for a correct configuration are the following, with the

* ### `widget.contentTypes` (Index ID / Content Types)

  This is the setting that determines where tags are saved. It may contain no value (allowing all content types), one value, or many values. Free tagging, i.e. creating new tags on the fly, will only be possible if this property contains exactly one value, because otherwise SvelteCMS wouldn't know how to save the new tags.

  If there is no Content Type with this name, then all of the tags and backlinks will be saved in an Index. Once a Content Type has been created, any tags in that index file will be editable like any other piece of content.

* ### `widget.displayKey` (Display Key)

  This setting determines where the main text for the tag gets saved. It defaults to `title` but may be changed. The corresponding field on the Content Type must have this as its name, *not type*, i.e.
  ```
  fields:
    name: title # WRONG!
  ```
  is wrong, but
  ```
  fields:
     title: text
  ```
  is fine.

* ### `widget.referenceKey` (Reference Key)

  This is the field, in whatever type of content is referenced, where backlinks will be saved. If it isn't provided, or if the field doesn't exist on a Content Type, then those references will be one-way. Again, what is important is the name of the field, *not it's type*. So if you wanted to rename the default `taggedContent` field, e.g.:
  ```
  contentTypes:
    tags:
      fields:
        title: title
        content: contentReference
  ```
  then you would also have to change the configuration of the `tags` field:
  ```
  fields:
    tags:
      ...
      widget:
        ...
        referenceKey: content
  ```
