class opml{
    constructor(params) {
        var me = this;
        this.data = [];
        this.dashboard = [];
        this.flux = [];
        this.urlData = params.urlData ? params.urlData : false;
        this.idCont = params.idCont ? params.idCont : false;

        this.init = function () {

            d3.xml(me.urlData, function(error, data) {
                if (error) throw error;
                me.data = data;

                //récupère la définition du dashboard
                me.dashboard = [].map.call(data.querySelectorAll("head"), function(head) {
                    return {
                    title: head.querySelector("title").textContent,
                    data: head.querySelector("creationDate").textContent
                    };
                });
                //récupère les flux
                let arrGroup = [], nbGroup=1, arrFlux = [];
                data.querySelectorAll("outline").forEach(function(outline) {
                    if(outline.getAttribute("icon")=="rss"){
                        outline.querySelectorAll("outline").forEach(function(rss, i) {
                            if(!arrGroup[outline.getAttribute("title")]){
                                arrGroup[outline.getAttribute("title")]=nbGroup;
                                me.flux.push({title: outline.getAttribute("title"),'rss':[]});
                                nbGroup++;
                            }
                            let idGroup = arrGroup[outline.getAttribute("title")]-1; 
                            if(!arrFlux[rss.getAttribute("title")]){
                                me.flux[idGroup].rss.push(
                                    {
                                        title: rss.getAttribute("title"),
                                        xmlUrl: rss.getAttribute("xmlUrl"),
                                        htmlUrl: rss.getAttribute("creationDate")
                                    }                                
                                )    
                                arrFlux[rss.getAttribute("title")]=1;
                            }else{
                                arrFlux[rss.getAttribute("title")]+=1;
                            }
                        });
                    }
                });
                console.log(me.flux);

                /*récupère le contenu du flux
                me.flux.forEach(function(f){

                });
                */

                //construction de la visualisation
                d3.select('#'+me.idCont).html('');
                let groupe = d3.select('#'+me.idCont).selectAll('ul').data(me.flux).enter()
                    .append('ul')
                    .html(function(d){
                        return d.title;
                        });
                let rss = groupe.selectAll('li').data(function(d){
                    return d.rss
                }).enter()
                .append('li')
                .html(function(r){
                    return '<a href="'+r.xmlUrl+'" >'+r.title+'</a>';
                    });

            });

           
        };

        this.init();
    }
}


  
