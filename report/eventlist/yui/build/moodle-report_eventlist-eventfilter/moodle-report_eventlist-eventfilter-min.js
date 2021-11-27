YUI.add("moodle-report_eventlist-eventfilter",function(g,e){function t(){t.superclass.constructor.apply(this,arguments)}var l="#id_eventname",n="#id_eventcomponent",i="#id_eventedulevel",a="#id_eventcrud",r="#id_filterbutton",s="#id_clearbutton";g.extend(t,g.Base,{_table:null,_eventName:null,_component:null,_eduLevel:null,_crud:null,initializer:function(){var e=g.one(r),t=g.one(s);this._createTable(this.get("tabledata")),this._eventName=g.one(l),this._component=g.one(n),this._eduLevel=g.one(i),this._crud=g.one(a),this._eventName.on("valuechange",this._totalFilter,this),e.on("click",this._totalFilter,this),t.on("click",this._clearFilter,this)},_createTable:function(e){var t=new g.DataTable({columns:[{key:"fulleventname",label:M.util.get_string("eventname","report_eventlist"),allowHTML:!0,sortable:!0,sortFn:function(e,t,l){var n=e.getAttrs().raweventname,i=t.getAttrs().raweventname<n?1:-1;return l?-i:i},title:M.util.get_string("eventname","report_eventlist")},{key:"component",label:M.util.get_string("component","report_eventlist"),allowHTML:!0,sortable:!0,title:M.util.get_string("component","report_eventlist")},{key:"edulevel",label:M.util.get_string("edulevel","report_eventlist"),sortable:!0,title:M.util.get_string("edulevel","report_eventlist")},{key:"crud",label:M.util.get_string("crud","report_eventlist"),sortable:!0,title:M.util.get_string("crud","report_eventlist")},{key:"objecttable",label:M.util.get_string("affectedtable","report_eventlist"),sortable:!0,title:M.util.get_string("affectedtable","report_eventlist")},{key:"since",label:M.util.get_string("since","report_eventlist"),sortable:!0,title:M.util.get_string("since","report_eventlist")},{key:"legacyevent",label:M.util.get_string("legacyevent","report_eventlist"),sortable:!0,title:M.util.get_string("legacyevent","report_eventlist")}],data:e,strings:{sortBy:"{title}",reverseSortBy:"{title}"}});return t.render("#report-eventlist-table"),t.get("boundingBox").addClass("report-eventlist-datatable-table"),this._table=t,this},_totalFilter:function(){var e,t,l,n,i,a,r=this._eventName.get("value").toLowerCase(),s=this._component.get("value"),o=this._eduLevel.get("options").item(this._eduLevel.get("selectedIndex")).get("text").toLowerCase(),u=this._eduLevel.get("value"),v=this._crud.get("options").item(this._crud.get("selectedIndex")).get("text").toLowerCase(),_=this._crud.get("value"),d=[];for(e=0;e<this.get("tabledata").length;e++)l=0<=(t=g.Node.create(this.get("tabledata")[e].fulleventname).get("text")).toLowerCase().indexOf(r),n=0<=t.toLowerCase().indexOf("\\"+s+"\\event\\"),i=0<=this.get("tabledata")[e].edulevel.toLowerCase().indexOf(o),a=0<=this.get("tabledata")[e].crud.toLowerCase().indexOf(v),""===r&&(l=!0),"0"===s&&(n=!0),"0"===u&&(i=!0),"0"===_&&(a=!0),l&&n&&i&&a&&d.push(this.get("tabledata")[e]);this._table.set("data",d)},_clearFilter:function(){this._eventName.set("value",""),this._component.set("value","0"),this._eduLevel.set("value","0"),this._crud.set("value","0"),this._table.set("data",this.get("tabledata"))}},{NAME:"eventFilter",ATTRS:{tabledata:{value:null}}}),g.namespace("M.report_eventlist.EventFilter").init=function(e){return new t(e)}},"@VERSION@",{requires:["base","event","node","node-event-delegate","datatable","autocomplete","autocomplete-filters"]});