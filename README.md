# msc-tags-collector

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/yauction-category-picker) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/24002/branches/734881/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=24002&bid=734881)

&lt;msc-tags-collector /> is a web component for input tags purpose. Users could key in anything they like (include space). Besides that sorting has already build-in with &lt;msc-tags-collector />. We can go by 「`DRAG`」and「`DROP`」or `←`、`→` to arrange tag orders we like.


![<msc-tags-collector />](https://blog.lalacube.com/mei/img/preview/msc-tags-collector.png)

## Basic Usage

&lt;msc-tags-collector /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-tags-collector />'s html structure and everything will be all set.

## Required Script

```html
<script
  type="module"
  src="https://your-domain/wc-msc-tags-collector.js">        
</script>
```

## Structure

Put &lt;msc-tags-collector /> into HTML document. It will have different functions and looks with attribute mutation.

```html
<msc-tags-collector>
  <script type="application/json">
    {
      "placeholder": [
        "web component",
        "msc-tags-collector",
        "fantasy",
        "drama",
        "mew 😺"
      ],
      "illegalkeys": ["#", " "],
      "l10n": {
        "placeholder": "tag"
      },
      "limitation": {
        "maxcount": 10,
        "maxlength": 30
      }
    }
  </script>
</msc-tags-collector>
```

Otherwise, developers could also choose remoteconfig to fetch config for &lt;msc-tags-collector />.

```html
<msc-tags-collector
  remoteconfig="https://your-domain/api-path"
>
</msc-tags-collector>
```

## Basic Usage

&lt;msc-tags-collector /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscTagsCollector } from 'https://your-domain/wc-msc-tags-collector.js';

// use DOM api
const nodeA = document.createElement('msc-tags-collector');
document.body.appendChild(nodeA);
nodeA.illegalkeys = ['#'];
nodeA.placeholder = [
  'normal 😺',
  'happy 😸',
  'laugh 😹',
  'like 😻'
];

// new instance with Class
const nodeB = new MscTagsCollector();
document.body.appendChild(nodeB);
nodeB.placeholder = [
  'normal 😺',
  'happy 😸',
  'laugh 😹',
  'like 😻'
];

// new instance with Class & default config
const config = {
  {
    "placeholder": [
      "web component",
      "msc-tags-collector",
      "fantasy",
      "drama",
      "mew 😺"
    ],
    "l10n": {
      "placeholder": "tag"
    },
    "limitation": {
      "maxcount": 10,
      "maxlength": 30
    }
  }
};
const nodeC = new MscTagsCollector(config);
document.body.appendChild(nodeC);
</script>
```

## Storage

&lt;msc-tags-collector /> will generate an input[type=hidden] as storage and put success inputed tags data as its value. <input /> default name is `msc-tags-collector`, developers can switch any name they liked.

```html
<msc-tags-collector>
  <input type="hidden" name="msc-tags-collector" value="..." />
</msc-tags-collector>
```

## Style Customization

Developers could apply styles to decorate &lt;msc-tags-collector />'s looking.

```html
<style>
msc-tags-collector {
  /* main */
  --msc-tags-collector-padding: 12px;
  --msc-tags-collector-gap: 12px;

  /* input */
  --msc-tags-collector-input-color: rgba(35 42 49);
  --msc-tags-collector-input-placeholder-color: rgba(151 158 168);
  --msc-tags-collector-caret-color: rgba(35 42 49);

  /* tags */
  --msc-tags-collector-tag-color: rgba(70, 78, 86);
  --msc-tags-collector-tag-background-color: rgba(224 228 233);
  --msc-tags-collector-tag-focus-border-color: rgba(101 160 249);
  --msc-tags-collector-tag-remove-color: rgba(91 99 106);
}
</style>
```

## Attributes

&lt;msc-tags-collector /> supports some attributes to let it become more convenience & useful.

- **placeholder**

Set placeholder for &lt;msc-tags-collector />. It should be JSON string. Developers could set default tags here. Default is `[]` (not set).

```html
<msc-tags-collector
  placeholder='["normal 😺","happy 😸","laugh 😹","like 😻"]'
>
  ...
</msc-tags-collector>
```

- **illegalkeys**

Set illegal keys for &lt;msc-tags-collector />. It should be JSON string. Developers could set illegal keys here (some keys you don't want user input). Default is `[]` (not set).

```html
<msc-tags-collector
  illegalkeys='["#"," "]'
>
  ...
</msc-tags-collector>
```

- **l10n**

Set localization for &lt;msc-tags-collector />. It will replace some text to anything you like. It should be JSON string. Developers could set input's `placeholder` here.

- `placeholder`：input field placeholder content. Default is `tag`.

```html
<msc-tags-collector
  l10n='{"placeholder":"tag"}'
>
  ...
</msc-tags-collector>
```

- **limitation**

Set limitation for &lt;msc-tags-collector />. It should be JSON string. Developers could set `maxcount` and `maxlength` here.

- `maxcount`：maximum tags count. Default is `10`.
- `maxlength`：input maxlength setting. Default is `30`.

```html
<msc-tags-collector
  limitation='{"maxcount":10,"maxlength":30}'
>
  ...
</msc-tags-collector>
```


## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| placeholder | Array | Getter / Setter for placeholder. Developers could set default tags here. Default is `[]`. |
| illegalkeys | Array | Getter / Setter for illegalkeys. Developers could set illegal keys here (some keys you don't want user input). Default is `[]`. |
| l10n | Object | Getter / Setter for l10n. Developers could set input's `placeholder` here. Default is `tag`. |
| limitation | Object | Getter / Setter for limitation. Developers could set `maxcount` and `maxlength` here. |
| tagsInfo | Array | Getter for current &lt;msc-tags-collector />'s tags information. |
| count | Number | Getter for current &lt;msc-tags-collector />'s tags count. |


## Method

| Method Signature | Description |
| ----------- | ----------- |
| addTag(tag) | Add tag you like. |
| removeTag(tag) | Remove tag you like. |
| removeAll | Remove all tags. |
| focus | Focus on input field. |

## Event

| Event Signature | Description |
| ----------- | ----------- |
| msc-tags-collector-input | Fired when user input something. Developers could gather input content > `{ tag }` through `event.detail`. |
| msc-tags-collector-mutate | Fired when &lt;msc-tags-collector /> tags mutated (include `add` / `remove` / `sort` actions). Developers could gather current inputed tags > `{ tags }` through `event.detail`. |
| msc-tags-collector-error | Fired when &lt;msc-tags-collector /> error occured. Develpoers could gather information through `event.detail`.） |

## Reference
- [&lt;msc-tags-collector /> DEMO](https://blog.lalacube.com/mei/webComponent_msc-tags-collector.html)
- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/element/msc-tags-collector)
- [YouTube](https://www.youtube.com/watch?v=VTyIbr04Qmc)
