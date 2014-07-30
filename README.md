ROBIN-JSP
=============


Makes your robin button a pull-up chat window.

## Setup

Add the following code to the bottom of your page (right before the closing `</body>` tag) and above the existing Robin script.

```HTML
<script type="text/javascript">
        var robin_settings = {
            baseUrl: "https://selfservice-acc.robinhq.com/",
            openAnimation: function () {
                Robin.Animator.open();
            },
            closeAnimation: function () {
                Robin.Animator.close();
            },
            popup : {
                buttonWidth: 250,
                openWidth: 330,
                bubbleText: 'need some help?'
            }
        }
    </script>
```

Next, upload the file `build/robin-jsp.min.js` to your preferred directory on your web server.
After that, include it right after the script we just placed. Like so:

```HTML
<script type="text/javascript" src="path/to/your/uploaded/robin-jsp.min.js"></script>
```

Afterwards, you should have something like this:

```HTML
<script type="text/javascript">
        var robin_settings = {
            baseUrl: "https://selfservice-acc.robinhq.com/",
            openAnimation: function () {
                Robin.Animator.open();
            },
            closeAnimation: function () {
                Robin.Animator.close();
            },
            popup : {
                buttonWidth: 250,
                openWidth: 330,
                bubbleText: 'need some help?'
            }
        }
    </script>
    <script type="text/javascript" src="path/to/your/uploaded/robin-jsp.min.js"></script>
    <script src="https://selfservice.robinhq.com/external/robin/[yourapikey].js" async="async"></script>
```

You can find the location for the last script inside your ROBIN account by going to Settings -> Contact tab and copy/paste the script you see there.
