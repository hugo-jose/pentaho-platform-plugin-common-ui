dojo.provide("pentaho.common.propertiesPanel.Configuration");
dojo.require("dojo.dnd.Source");
dojo.require("dojo.Stateful");

dojo.declare(
    "pentaho.common.propertiesPanel.Configuration",
    dojo.Stateful,
    {
      constructor: function(configuration){
        this.items = [];
        this.rawConfiguration = configuration;
        if(configuration.properties){
          dojo.forEach(configuration.properties, this.initializeItem, this);
        }
      },
      initializeItem: function(item){

        var propertyClass = pentaho.common.propertiesPanel.Configuration.registeredTypes[item.ui.type];
        if (!propertyClass) {
          throw "No Properties Panel UI implementation found for " + item.ui.type;
        }
        var propItem = new propertyClass(item);
        var outterThis = this;
        propItem.watch(function(propName, prevVal, newVal){
          outterThis.onPropertyChange(this, propName, prevVal, newVal);
        });
        this.items.push( propItem );
      },
      onPropertyChange: function(item, propName, prevVal, newVal){

      },
      byId: function(id){
        for(var i=0; i<this.items.length; i++){
          if(this.items[i].id == id){
            return this.items[i];
          }
        }
      }

    });
pentaho.common.propertiesPanel.Configuration.registeredTypes = {};

dojo.declare(
    "pentaho.common.propertiesPanel.Property",
    [dojo.Stateful],
    {
      constructor: function(item){
        this.item = item;
        dojo.mixin(this, item);
      },
      value: null,
      setValue: function(value){
        this.value = value;
        onValueChange(value);
      },
      onValueChange: function(val){

      }
    });



dojo.declare(
    "pentaho.common.propertiesPanel.GemBar",
    [pentaho.common.propertiesPanel.Property],
    {
      gems: [],
      constructor: function(item){
        this.inherited(arguments);
        dojo.safeMixin(this, item);
      },
      postCreate: function(){

      },
      remove: function(gem){
        this.gems.splice(this.gems.indexOf(gem), 1);

        // fire event
        this.set("gems", this.gems);
      },
      add: function(gem){
        this.gems.push(gem);

        // fire event
        this.set("gems", this.gems);
      },
      reordered: function(){
        this.set("gems", this.gems);
      },

      gems: [],
      selectedGem: null

    }
);
pentaho.common.propertiesPanel.Configuration.registeredTypes["gemBar"] = pentaho.common.propertiesPanel.GemBar;
pentaho.common.propertiesPanel.Configuration.registeredTypes["gem"] = pentaho.common.propertiesPanel.Property;
pentaho.common.propertiesPanel.Configuration.registeredTypes["combo"] = pentaho.common.propertiesPanel.Property;
pentaho.common.propertiesPanel.Configuration.registeredTypes["slider"] = pentaho.common.propertiesPanel.Property;
pentaho.common.propertiesPanel.Configuration.registeredTypes["textbox"] = pentaho.common.propertiesPanel.Property;
pentaho.common.propertiesPanel.Configuration.registeredTypes["checkbox"] = pentaho.common.propertiesPanel.Property;


