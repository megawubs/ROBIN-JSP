ROBIN-JSP
=============

Use **ROBIN-JSP** to set additional settings for the ROBIN tab on your site. [ROBIN](http://robinhq.com) is the all-in-one customer service solution. The ROBIN-JSP library is not officially supported (or developed) by ROBIN.

## Installation

Replace the ROBIN javascript on your site
```html
<script src="https://selfservice.robinhq.com/external/robin/123456.js" async="async"></script>
```
With the example code shown below (don't forget to edit the settings to match your preferred setup).

## Example

Use the following code to always show the ROBIN tab on your site, except when a visitor uses a mobile device. The position of the contact tab is half way on the right side of your screen.
```html
<script type="text/javascript">
var robin_JSP_settings = {
  apikey      : '123456', // Set your API key (REQUIRED)
  hideMobile  : true,     // Hide the ROBIN tab on mobile devices
  hideOffline : false,    // Show the ROBIN tab even when you're offline
  customTop   : '30%',     // Adjust the vertical position of the ROBIN tab
  theme       : 'theme-name' //the theme for the tab, overwrites the customTop setting
};
</script>
<!-- this script tag will always load the latest version of robin-jsp -->
<script type="text/javascript" src="http://cdn.jsdelivr.net/robinjsp/latest/robin-jsp.min.js" async="async"></script> 

```

## Settings

  * `apikey` - your [ROBIN apikey](http://robinhq.com/support/obtain-api-key/) (REQUIRED).
  * `hideMobile` - true/false, hide/show the ROBIN tab on mobile devices.
  * `hideOffline` - true/false, hide/show the ROBIN tab when you're offline.
  * `customTop` - adjust the vertical position of the ROBIN tab on your site (including '%' or 'px').
  * `logging` - true/false, enable/disable logging in the browser console
  * `theme` - choose the layout of your robin button, currently you can choose `ribbon`, `landscape` and `big-button`. This setting will overwrite customTop