/**
 * npm middleware list
 */
const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const Joi = require('joi');
const path = require('path');
const multer = require('multer');

/**
 * Schema require list
 */
const User = require('../model/userSchema');
const ListOfRoles = require('../model/listOfRolesSchema');
const ListOfResourceOrAction = require('../model/listOfResourceOrActionSchema');
const UserRoles = require('../model/userRolesSchema');
const RoleWiseResourcePermission = require('../model/roleWiseResourcePermissionSchema');

/**
 * Service list
 */
const userDS = require('../service/userDataService');

// Image upload configur
const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, next) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, '-');
    next(null, date + file.originalname);
  }
});
const upload = multer({
  storage: storage,
}).single('userImage');

//   const fileFilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };

//   const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter
//   }).single('userImage');


/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {

  try {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(201).json({
          message: "A Multer error occurred when uploading.",
          error: err
        }); 
      } else if (err) {
        // An unknown error occurred when uploading.
        res.status(201).json({
          message: "An unknown error occurred when uploading.",
          error: err
        });
      } else {
        if (!req.body) {
          res.status(400).json({
            "message": "User content can not be empty"
          });
          return;
        }
        // Create a User
        const userSchema = Joi.object({
          fullname: Joi.string().required(),
          email: Joi.string().email(),
          password: Joi.string().required(),
          userImage: Joi.any()
        });
        Joi.validate(req.body, userSchema, (err, value) => {
          if (err) {
            next(err);
          } else {
            User.findOne({
              email: value.email
            }).then((result) => {
              if (result) {
                res.status(200).json({
                  message: 'Account with that email address already exists.'
                });
              } else {
                if (req.file) {
                  var user = new User({
                    fullname: value.fullname,
                    email: value.email,
                    password: value.password,
                    userImage: req.file.filename,
                  });
                } else {
                  var user = new User({
                    fullname: value.fullname,
                    email: value.email,
                    password: value.password,
                  });
                }
                user.save().then((result) => {
                  res.status(200).json(result);
                }).catch((err) => {
                  if (err.name === 'ValidationError') {
                    var valErrors = [];
                    Object.keys(err.errors).forEach((key) => {
                      var b = {};
                      b[key] = err.errors[key].message;
                      valErrors.push(b);
                    });
                    return res.status(404).send(valErrors);
                  }
                  return res.status(404).json(err);
                });
              }
            }).catch((err) => {
              return res.status(404).json(err);
            });
          }
        });
      }
    });
  } catch (error) {
    res.json({
      "message": "block of code for errors!"
    });
  }
};


/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        "message": "Email is not valid and Password cannot be blank"
      });
    } else {
      const userSchema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().required(),
      });
      Joi.validate(req.body, userSchema, (err, value) => {
        if (err) {
          return res.status(404).json(err);
        } else {
          // call for passport authentication
          passport.authenticate('local', (err, user, info) => {
            // error from passport middleware
            if (err) {
              return res.status(400).json(err);
            } else if (user) {
              // registered user
              return res.status(200).json({
                "token": user.generateJwt()
              });
            } else {
              // unknown user or wrong password
              return res.status(404).json({
                message: info.message
              });
            }
          })(req, res);
        }
      });
    }

  } catch (error) {
    res.json({
      "message": "block of code for errors!"
    });
  }

};

/**
 * GET /account
 * get All Account.
 */

// exports.getAllAccount = (req, res) => {
//   User.find({}, 'fullname email userImage').exec((err, data) => {
//     if (err) {
//       res.status(201).json(err);
//     } else {
//       res.status(200).json(data);
//     }
//   });
// };

exports.getAllUserAccounts = async function (req, res) {
  try {
    let response = await userDS.getAllUserAccounts();
    if (response.length > 0) {
      res.status(200).json(response);
    } else {
      res.status(200).json(response);
    }
    console.log(response);
  } catch(err) {
    res.status(201).json(err);
  }
}



exports.postUserAccount = async function (req, res, next) {

}
exports.updateUserAccount = async function (req, res, next) {

}
exports.deleteUserAccount = async function (req, res, next) {
  try {
    User.findByIdAndDelete({
      _id: req.body._id
    }).exec((err, data) => {
      if (!data) {
        res.status(200).json({
          name: "not found"
        });
      } else if (data) {
        res.status(200).json(data);
      } else {
        res.status(500).json({
          error: err
        });
      }
    });

  } catch (error) {
    res.json({
      "message": "block of code for errors!"
    });
  }
}

exports.getUserAccountById = async function (req, res, next) {
  try {
    let response = await userDS.getUserAccountById(req.params.id);
    if (response.length > 0) {
      res.status(200).json(response);
    } else {
      res.status(200).json(response);
    }
    
  } catch (error) {
    res.status(201).json(error);
  }
}

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */

exports.postForgot = (req, res, next) => {}

/**
 * GET /account/profile
 * Profile page.
 */
exports.getUserProfile = (req, res, next) => {
  User.findOne({
      _id: req._id
    },
    (err, user) => {
      if (!user) {
        res.status(404).json({
          status: false,
          message: 'User record not found.'
        });
      } else {
        userDS.getUserRoleById(user.id).then((result) => {
          if (result.length === 0) {
            res.status(200).json({
              status: true,
              user: _.pick(user, ['fullname',  'email', 'address', 'birthofdate', 'city', 'country', 'zip', 'designation', 'mobile', 'phone','userImage'])
            });
          } else {
            const userrole = [];
            if (result.length > 0) {
              if (result[0].role_id) {
                for (const iterator of result[0].role_id) {
                  userrole.push(iterator.name);
                }
                user.role = userrole;
              }
              res.status(200).json({
                status: true,
                user: _.pick(user, ['fullname',  'email', 'address', 'birthofdate', 'city', 'country', 'zip', 'designation', 'mobile', 'phone','userImage', 'role',])
              });

            }
          }

        }).catch((err) => {
          res.status(404).json(err);
        });
      }
    }
  );
}

/**
 * POST /account/profile
 * Update profile information.
 */

exports.postUpdateProfile = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({
      "message": "Email is not valid and Password cannot be blank"
    });
  } else {
    const userSchema = Joi.object({
      fullname: Joi.string().required(),
      email: Joi.string().email(),
      designation: Joi.string().optional(),
      address: Joi.string().optional(),
      country: Joi.string().optional(),
      city: Joi.string().optional(),
      mobile: Joi.string().optional(),
      phone: Joi.string().optional(),
      zip: Joi.string().optional(),
      birthofdate: Joi.string().optional(),
      userImage: Joi.string().optional(),
    });
    Joi.validate(req.body, userSchema, (err, value) => {
      if (err) {
        res.status(404).json(err);
      } else {
        User.findById(req._id, (err, user) => {
          if (err) {
            res.status(404).json(err);
          }
          user.fullname = req.body.fullname || '';
          user.email = req.body.email || '';
          user.designation = req.body.designation || '';
          user.address = req.body.address || '';
          user.country = req.body.country || '';
          user.city = req.body.city || '';
          user.mobile = req.body.mobile || '';
          user.phone = req.body.phone || '';
          user.birthofdate = req.body.birthofdate || '';
          user.zip = req.body.zip || '';
          user.userImage = req.body.userImage || '';
          user.save((err) => {
            if (err) {
              if (err.code === 11000) {
                res.status(404).json({
                  message: 'The email address you have entered is already associated with an account.'
                })
              }
              res.status(404).json(err)
            }
            res.status(200).json({
              "success": "Profile information has been updated."
            });
          });
        });
      }
    });
  }

}

/**
 * POST /account/password
 * Update current password.
 */

exports.postUpdatePassword = (req, res, next) => {};

/**
 * POST /account/delete
 * Delete user account.
 */

exports.postDeleteAccount = (req, res, next) => {};





/******* Account Management **********/


/** ************************** List Of Roles *********************/
// getListOfRoles
exports.getListOfRoles = (req, res, next) => {
  ListOfRoles.find({}).exec((err, data) => {
    if (err) {
      res.status(201).json(err);
    } else {
      res.status(200).json(data);
    }
  });
};
// postListOfRoles
exports.postListOfRoles = (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        "message": "Role field is empty"
      });
    } else {
      const roleName = new ListOfRoles({
        name: req.body.name,
      });
      roleName.save().then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(201).json(err);
      });

    }
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }
};

// updateListOfRoles
exports.updateListOfRoles = async function (req, res, next) {
  try {
    ListOfRoles.findByIdAndUpdate(req.body._id, {
      name: req.body.name
    }).then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      res.status(201).json(err);
    });
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }

}
// deleteListOfRole
exports.deleteListOfRole = async function (req, res, next) {
  try {
    ListOfRoles.findByIdAndDelete({
      _id: req.body._id
    }).exec((err, data) => {
      if (!data) {
        res.status(200).json({
          name: "not found"
        });
      } else if (data) {
        res.status(200).json(data);
      } else {
        res.status(500).json({
          error: err
        });
      }
    });

  } catch (error) {
    res.json({
      "message": "block of code for errors!"
    });
  }
}

// deleteListOfRoleByID
exports.deleteListOfRoleByID = async function (req, res, next) {

  try {
    const deleteListOfRole = await new Promise((resolve, reject) => {
      ListOfRoles.findByIdAndDelete(req.params.name).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
    if (deleteListOfRole) {
      res.status(200).json({
        message: "Success"
      });
    } else {
      res.status(500).json({
        message: "There are some problem"
      });


    }
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }
}

// getListOfRoleByName
exports.getListOfRoleByName = async function (req, res, next) {
  try {
    const queryName = await new Promise((resolve, reject) => {
      ListOfRoles.findOne({
        name: req.params.name
      }).then((result) => resolve(result)).catch(reject)
    });
    if (queryName) {
      res.status(200).json({
        name: queryName.name
      });
    } else {
      res.status(200).json({
        name: "not found"
      });
    }
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }

}

// searchByListOfRoleName
exports.searchByListOfRoleName = async function (req, res, next) {
  try {

    const pattern = `/.*${req.body.name}.*/`;
    const valll = {
      "name": {
        $regex: req.body.name
      }
    }
    const incomingvalue = req.body.name.split('');

    ListOfRoles.find({
      "name": {
        $regex: req.body.name
      }
    }).exec((err, data) => {
      if (data.length === 0) {
        res.status(200).json({
          name: "not found"
        });
      } else if (data) {
        // const searchResult = [];

        //  _.find(data, (o) => {
        //     const splitvalue =  o.name.split("");
        //     const presents = _.intersectionWith(splitvalue, incomingvalue, _.isEqual);
        //     if(presents.length){
        //       searchResult.push(o);
        //     }
        // })
        // console.log(searchResult)
        res.status(200).json(data);
      } else {
        res.status(500).json({
          error: err
        });
      }
    })
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }
}


/** ********************************* List Of Resource Or Action ****************************** */
// getListOfResourceOrAction
exports.getListOfResourceOrAction = (req, res, next) => {
  ListOfResourceOrAction.find({}).exec((err, data) => {
    if (err) {
      res.status(201).json(err);
    } else {
      res.status(200).json(data);
    }
  });
};

// postListOfResourceOrAction
exports.postListOfResourceOrAction = (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        "message": "Role field is empty"
      });
    } else {
      const resourceName = new ListOfResourceOrAction({
        name: req.body.name,
      });
      resourceName.save().then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(201).json(err);
      });

    }
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }
};

// updateListOfResourceOrAction
exports.updateListOfResourceOrAction = async function (req, res, next) {
  try {
    ListOfResourceOrAction.findByIdAndUpdate(req.body._id, {
      name: req.body.name
    }).then((result) => {
      res.status(200).json(result);
    }).catch((err) => {
      res.status(201).json(err);
    });
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }

}
// deleteListOfResourceOrAction
exports.deleteListOfResourceOrAction = async function (req, res, next) {
  try {
    ListOfResourceOrAction.findByIdAndDelete({
      _id: req.body._id
    }).exec((err, data) => {
      if (!data) {
        res.status(200).json({
          name: "not found"
        });
      } else if (data) {
        res.status(200).json(data);
      } else {
        res.status(500).json({
          error: err
        });
      }
    });

  } catch (error) {
    res.json({
      "message": "block of code for errors!"
    });
  }
}

// deleteListOfResourceOrActionByID
exports.deleteListOfResourceOrActionByID = async function (req, res, next) {

  try {
    const deleteListOfRole = await new Promise((resolve, reject) => {
      ListOfResourceOrAction.findByIdAndDelete(req.params.name).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
    if (deleteListOfRole) {
      res.status(200).json({
        message: "Success"
      });
    } else {
      res.status(500).json({
        message: "There are some problem"
      });


    }
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }
}

// getListOfRoleByName
exports.getListOfResourceOrActionByName = async function (req, res, next) {
  try {
    const queryName = await new Promise((resolve, reject) => {
      ListOfResourceOrAction.findOne({
        name: req.params.name
      }).then((result) => resolve(result)).catch(reject)
    });
    if (queryName) {
      res.status(200).json({
        name: queryName.name
      });
    } else {
      res.status(200).json({
        name: "not found"
      });
    }
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }

}

// searchByListOfRoleName
exports.searchByListOfResourceOrActionName = async function (req, res, next) {
  try {

    const pattern = `/.*${req.body.name}.*/`;
    const valll = {
      "name": {
        $regex: req.body.name
      }
    }
    const incomingvalue = req.body.name.split('');

    ListOfResourceOrAction.find({
      "name": {
        $regex: req.body.name
      }
    }).exec((err, data) => {
      if (data.length === 0) {
        res.status(200).json({
          name: "not found"
        });
      } else if (data) {
        // const searchResult = [];

        //  _.find(data, (o) => {
        //     const splitvalue =  o.name.split("");
        //     const presents = _.intersectionWith(splitvalue, incomingvalue, _.isEqual);
        //     if(presents.length){
        //       searchResult.push(o);
        //     }
        // })
        // console.log(searchResult)
        res.status(200).json(data);
      } else {
        res.status(500).json({
          error: err
        });
      }
    })
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }
}

/** ******************************* User Roles ********************************** */

exports.getUserRoles = (req, res, next) => {
  // UserRoles.find({}).populate('user_id', 'fullname').populate('role_id', 'name').exec((err, data) => {
  UserRoles.find()
    .populate({
      path: 'user_id',
      select: ['fullname', 'email', 'userImage']
    })
    .populate('role_id', 'name').exec((err, data) => {
      if (err) {
        res.status(201).json(err);
      } else {
        res.status(200).json(data);
      }
    });
};

exports.postUserRoles = (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        "message": "Role field is empty"
      });
    } else {
      const userRole = new UserRoles({
        user_id: req.body.user_id,
        role_id: req.body.role_id,
      });
      userRole.save().then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(201).json(err);
      });

    }
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }
};

exports.getUserRoleById = (req, res, next) => {
  const requstId = req.params.id;
  UserRoles.find({
    user_id: requstId
  }).populate('role_id', 'name').exec((err, data) => {
    if (err) {
      res.status(201).json(err);
    } else {
      if (data.length != 0) {
        res.status(200).json(data);
      } else {
        res.status(200).json({
          message: "Not found"
        });
      }
    }
  })
}




exports.userRoleUpdateById = async function (req, res, next) {

  try {
    const requstId = req.params.id;
    const updateId = req.body.role_id;
    const isUser = await UserRoles.find({
      user_id: requstId
    });
    // const isUpdate = await UserRoles.find({role_id: updateId});

    if (isUser) {
      console.log(isUser[0].id)
      let id = mongoose.mongo.ObjectID(isUser[0].id)
      UserRoles.findByIdAndUpdate(
        isUser[0].id, {
          $set: {
            role_id: updateId
          }
        }, {
          new: true
        }).then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(200).json(err);
      });
    } else {
      console.log("error")
    }




    // UserRoles.find({user_id: requstId})
    // // .findByIdAndUpdate(req.params.id, {
    // //     name: req.body.name,
    // //     title: req.body.title,
    // //     description: req.body.description,
    // //     image: req.body.image,
    // //     nameSound: req.body.nameSound,
    // //     procedure: req.body.procedure,
    // //     videos: req.body.videos,
    // // }, {
    // //     new: true
    // // })
    // .populate('role_id').exec((err, data) => {
    //     if (err) {
    //         res.status(201).json(err);
    //     } else {
    //         res.status(200).json(data);
    //     }
    // });
  } catch (error) {
    console.log(error);
  }

}

exports.userRoleDeleteById = (req, res, next) => {}


/** ******************************* Role Wise Resource Permission ********************************** */

/**
 * Role Wise Resource Permission
 */
exports.getRoleWiseResourcePermission = (req, res, next) => {
  RoleWiseResourcePermission.find()
    .populate({
      path: 'role_id',
      select: ['name']
    })
    .populate('resource_id', 'name').exec((err, data) => {
      if (err) {
        res.status(201).json(err);
      } else {
        res.status(200).json(data);
      }
    });
};

exports.postRoleWiseResourcePermission = (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        "message": "Role field is empty"
      });
    } else {
      const roleWiseResource = new RoleWiseResourcePermission({
        user_id: req.body.user_id,
        role_id: req.body.role_id,
        resource_id: req.body.resource_id,
      });
      roleWiseResource.save().then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        res.status(201).json(err);
      });

    }
  } catch (error) {
    return res.json({
      "message": "block of code for errors!"
    });
  }
}

exports.getRoleWiseResourcePermissionById = (req, res, next) => {
  const requstId = req.params.id;
  RoleWiseResourcePermission.find({
    role_id: requstId
  }).populate('resource_id', 'name').exec((err, data) => {
    if (err) {
      res.status(201).json(err);
    } else {
      if (data.length != 0) {
        res.status(200).json(data);
      } else {
        res.status(200).json({
          message: "Not found"
        });
      }
    }
  })
}