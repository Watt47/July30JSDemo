var settings = {
    showerrors: false,
    language: "auto",
init: function(){
    if(localStorage.getItem("settings") === null) {
        localStorage.setItem("settings", JSON.stringify({showerrors: false, language: "auto"}));
    }
    settings.loadSettings();
    },
getLanguage: function(){
    if (this.language == "auto"){
        var lng = "en";
        navigator.languages.find(
            function(element){
                                 if (element.startsWith("en")){
                                    lng = "en";
                                    return true;
                                 }
                if (element.startsWith("ru")) {
                                 lng = "ru";
                                 return true;}
        });
        return lng;
    }else
    return this.language;
},
saveSettings: function(){
    localStorage.setItem("settings", JSON.stringify({showerrors: settings.showerrors, language: settings.language}));
},
loadSettings: function(){
    var opt = JSON.parse(localStorage.getItem("settings"));
    if (typeof opt.showerrors !== "undefined")
        settings.showerrors = opt.showerrors;
    if (typeof opt.language !== "undefined")
        settings.language = opt.language;
}
};