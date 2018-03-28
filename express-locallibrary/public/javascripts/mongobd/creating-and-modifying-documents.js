// step -1 

/**
 * create a record 
 * 
 */

 // Create an instance of model SomeModel
 var awesom_instance = new SomeModel({name: 'awesome'});
 
 // Save the new model instance, passsing a callback
 awesom_instance.save( function(err){
   if( err ) 
    return handleError(err);
    //save
 });

 /**
  * use create() to define the model instance at the same time as you save it.
  */
  SomeModel.create({name: 'also_awesome'}, function(err, awesome_instance) {
     if(err) 
      return handleError(err);
      // saved!
  });

  /**
   * 
   */
  // Access model field value using dot notation 
  console.log(awesom_instance.name); 
  // change recode by modifying the fields, thend calling 

  awesom_instance.name = "New cool name";
  awesom_instance.save(function(err){
    if (err) {
      return handleError(err); // saved!
    }
  });


  /**
   * Searching for records 
   * 
   */

   var Athlete = mongoose.model('Athlete', yourSchema);
   
   // Find all athletes who play tennis, selectiong the "name" and "age" fieldes
  Athlete.find({'sport': 'Tennis'}, 'name age', function(err, athletes){
    if(err) {
      return handleError(err);
    }
      // 'athletes' contains the list of athletes that match the criteria.
  });

  

  
