/*
 * starter app.jss (SSJS)
 */
 var u = {
   asVec: function(obj){
     /**
      * @author Eric McCormick
      * twitter: @edm00se
      * src: https://edm00se.io/xpages/consistent-multivalue-formatting/
      *
      * @param java.util.Object to examine
      * @return java.util.Vector of values from originating Object
      **/
     switch(typeof obj){
       case "java.util.Vector": //it's already a Vector, just return it
         return obj;
         break;
       case "java.util.ArrayList": //it's an ArrayList, return it as a Vector
       case "Array": //it's an Array prototype, return it as a Vector
         var x:java.util.Vector = new java.util.Vector();
         var s = obj.size()||obj.length;
         for(var i=0; i<s; i++){
           x.add(obj[i]);
         }
         return x;
         break;
       case "java.lang.String":
       default: //it's most likely a String or other individual value, return it as a Vector
         var x:java.util.Vector = new java.util.Vector();
         x.add(obj);
         return x;
         break;
     }
   }
 };
