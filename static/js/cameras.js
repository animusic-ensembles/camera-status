const API_URL = "https://rcshim04.pythonanywhere.com/cameras";

$(document).ready(function() {
    const key = new URLSearchParams(window.location.search).get("key");

    $(".clear").on("click tap", async function() {
        const response = await fetch(`${API_URL}?key=${key}`);
        const data = await response.json();
        if(data.error) {
            alert("No Key Provided");
            window.location.href="about:blank";
        }
        data.forEach(async (camera) => {
            camera.live = false;
        });
        await fetch(`${API_URL}?key=${key}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        $(".current").html("N/A");
    });

    $(document).on("click tap", ".select", async function() {
        const response = await fetch(`${API_URL}?key=${key}`);
        const data = await response.json();
        if(data.error) {
            alert("No Key Provided");
            window.location.href="about:blank";
        }
        data.forEach(async (camera) => {
            if(camera.name == $(this).attr("id")) {
                camera.live = !camera.live;
            } else {
                camera.live = false;
            }
        });
        await fetch(`${API_URL}?key=${key}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    });

    setInterval(async function() {
        const response = await fetch(`${API_URL}?key=${key}`);
        const data = await response.json();
        console.log(data);
        if(data.error) {
            alert("No Key Provided");
            window.location.href="about:blank";
        }
        let current = "N/A";
        data.forEach((camera) => {
            $(`#${camera.name} .icon`).html(camera.online ? "photo_camera" : "no_photography");
            let state = "inactive";
            let status = "Offline";

            if(camera.online) {
                status = "Online";
                state = "active";
                if(camera.ready) {
                    status = "Ready";
                    state = "select";
                }
                if(camera.live) {
                    status = "Live";
                    state = "select";
                    current = camera.name;
                }
            };
            if(status == "Live") $(`#${camera.name}`).addClass("live");
            else $(`#${camera.name}`).removeClass("live");
            $(`#${camera.name}`).removeClass("active inactive select").addClass(state);
            $(`#${camera.name} .icon`).html(camera.online ? "photo_camera" : "no_photography");
            $(`#${camera.name} .status`).html(status);
        });
        $(".current").html(current);
    }, 200);
});