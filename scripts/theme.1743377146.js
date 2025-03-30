"use strict";

let get_theme = () => {
    let m = localStorage.getItem("theme");

    if (m === "dark")
        return "dark";
    else if (m === "auto")
        return "auto";
    else
        return "light";
};

let update_theme = theme => {
    if (theme == "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
    } else if (theme == "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
    } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.remove("dark");
    }
};

update_theme(get_theme());
