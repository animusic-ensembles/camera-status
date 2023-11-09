const API_URL = "https://rcshim04.pythonanywhere.com/cameras";

$(document).ready(function() {
    const name = window.location.pathname.split("/")[1];
    const key = new URLSearchParams(window.location.search).get("key");

    $(document).on("click tap", ".active", async function() {
        const response = await fetch(`${API_URL}?key=${key}`);
        const data = await response.json();
        if(data.error) {
            alert("No Key Provided");
            window.location.href="about:blank";
        }
        data.forEach(async (camera) => {
            if(camera.name != name) return;
            if($(this).attr("id") == "online") {
                camera.online = !camera.online;
            } else if($(this).attr("id") == "ready") {
                camera.ready = !camera.ready;
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
            let status = "Offline";
            if(camera.online) {
                status = "Online";
                if(camera.ready) status = "Ready";
                if(camera.live) {
                    status = "Live";
                    current = camera.name;
                }
            };
            if(camera.name != name) return;
            if(!camera.online) {
                $("#ready").removeClass("active").addClass("inactive");
            } else {
                $("#ready").removeClass("inactive").addClass("active");
            }
            if(camera.ready) {
                $("#online").removeClass("active").addClass("inactive");
            } else {
                $("#online").removeClass("inactive").addClass("active");
            }
            if(camera.live) {
                $("#online").removeClass("active").addClass("inactive");
                $("#ready").removeClass("active").addClass("inactive");
            }
            $("#online").html(camera.online ? "Go Offline" : "Go Online");
            $("#ready").html(camera.ready ? "Not Ready" : "Ready");
            $(`.status`).html(status).removeClass("offline online ready live").addClass(status.toLowerCase());
        });
        $(".current").html(current);
    }, 200);
});