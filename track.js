document.addEventListener("DOMContentLoaded", function () {

        //var server_ip = "http://104.131.149.197:8080/";
        var server_ip = "http://localhost:8080";

        var sample_rate = 20; // fps to send data when cursor is moving
        var inactive_cd = 200; // after 250ms, consider mouse as inactive
        var inactive_timer; // a flag indicates start of inactive time countdown before trigger stop code
        var interval_timer;
        var isIntervalSet = false;
        var timestamp
        var xcoord, ycoord;
        var elementMouseIsOver; // calculate which element was under cursor

        function handleEvent(e) {

            var evtType = e.type;

            // calculate absolute coordinates, IE<9 compatible-ish
            xcoord = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            ycoord = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

            // calculate which mouse button was pressed
            // fix IE button/which behaviour
            if (!e.which && e.button) {
                if (e.button & 1) e.which = 1 // Left
                else if (e.button & 4) e.which = 2 // Middle
                else if (e.button & 2) e.which = 3 // Right
            }

            // TODO: fix console error bug here
            elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);

            // define mousestop event
            var onmousestop = function () {
                // reset interval timer
                clearInterval(interval_timer);
                isIntervalSet = false;

                //elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
                send_data("mousestop", e.which, xcoord, ycoord, elementMouseIsOver);
                console.log("MOUSESTOP: " + "x=" + xcoord + ", y=" + ycoord + ", over=" + elementMouseIsOver);
            }

            // for mousemove event, set an interval to reduce traffic
            if (evtType.toLowerCase() == "mousemove") {
                // clear the countdown timer set by last movement during moving
                clearTimeout(inactive_timer);

                // this must be examined before setIntervals
                inactive_timer = setTimeout(onmousestop, inactive_cd);

                if (isIntervalSet) return;
                // start an interval timer on first move of cursor, and set a flag
                // to ensure only one interval timer is active.
                // when mouse stops, clear this timer
                interval_timer = setInterval(function () {
                    // send data back to server
                //send_data(e.type, e.which, xcoord, ycoord, elementMouseIsOver);
                    console.log(evtType.toUpperCase() + ": x=" + xcoord + ", y=" + ycoord + ", over=" + elementMouseIsOver);
                }, 1000 / sample_rate);
                isIntervalSet = true;
            } else {
                // send data back to server
                send_data(e.type, e.which, xcoord, ycoord, elementMouseIsOver);
                console.log(evtType.toUpperCase() + ": which=" + e.which + ", x=" + xcoord + ", y=" + ycoord + ", over=" + elementMouseIsOver);
            }
        }

        // send which mousebutton, x and y coordinates, element under cursor
        function send_data(evt, btn, x, y, el) {
            var timestamp = new Date();
            var payload = {
                "time": timestamp.getTime(),
                "evt": evt.toUpperCase(),
                "btn": btn,
                "x": x,
                "y": y,
                "el": el.toString()
            };
            //console.log(JSON.stringify(payload));

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", server_ip, true);
            xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            xmlhttp.send(JSON.stringify(payload));

            // xmlhttp call back function
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
                    // echo unsuccessful data only
                    console.log('error sending data to server!!!');
                    //console.log(xmlhttp.responseText);
                }
            }
        }

        // mousemove and mousestop
        document.addEventListener('mousemove', handleEvent, false);
        //dblclick
        document.getElementsByTagName("body")[0].addEventListener('dblclick', handleEvent, false)
            //contextmenu (rightclick)
        document.getElementsByTagName("body")[0].addEventListener('contextmenu', handleEvent, false)
            //click
        document.getElementsByTagName("body")[0].addEventListener('click', handleEvent, false)

        document.addEventListener('mousedown', handleEvent, false)
        document.addEventListener('mouseup', handleEvent, false)

        //scroll
        document.addEventListener('scroll', handleEvent, false)
            //mouseover (hover)??
    }, false) // bad way: window.onload = init;
