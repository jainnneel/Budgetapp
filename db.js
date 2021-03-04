const firebaseConfig = {
    apiKey: "AIzaSyDBARQkJXCiELqwdaq6wAEiJ1SJdKyLpDQ",
    authDomain: "badget-7d2e5.firebaseapp.com",
    databaseURL: "https://badget-7d2e5-default-rtdb.firebaseio.com",
    projectId: "badget-7d2e5",
    storageBucket: "badget-7d2e5.appspot.com",
    messagingSenderId: "388376641692",
    appId: "1:388376641692:web:e74eff1e379f24e43eed59"
  };

  firebase.initializeApp(firebaseConfig);

  // Reference messages collection
  var messagesRef = firebase.database().ref('user_data');
//   getdata()
  function getdata(){
    firebase.database().ref('users').on('value',(snap)=>{
        snap.forEach(function(childSnapshot) {
            console.log(childSnapshot.val())
          });
      });
  }
  // Listen for form submit
//   document.getElementById('entry').addEventListener('submit', submitForm);
  
//   // Submit form
//   function submitForm(e){
//     e.preventDefault();
  
//     // Get values
//     var fname = getInputVal('fname');
//     var lname = getInputVal('lname');

  
//     // Save message
//     saveMessage(fname,lname);
  
  
//     // Clear form
//     document.getElementById('entry').reset();
    
//   }
  
//   // Function to get get form values
//   function getInputVal(id){
//     return document.getElementById(id).value;
//   }
  
  

  
  let uiController = (function(){

    const fieldsClass = {
        type:'.type',
        desc:'.desc',   
        amt:'.amt',
        tablein:'tableincome',
        tableex:'tableexpanses',
        tcase:'.tcase',
        tincome:'.tincome',
        texpanse:'.texpanse',
        main:'.main'
    }

    return {
        getinput:function(){
        return{    
            type:document.querySelector(fieldsClass.type).value,
            desc:document.querySelector(fieldsClass.desc).value,
            amt:parseFloat(document.querySelector(fieldsClass.amt).value)
          };
        },
        getfieldsClass:function(){
            return fieldsClass;
        },
        showdata:function(){
            document.getElementById(fieldsClass.tablein).innerHTML = "";
            document.getElementById(fieldsClass.tableex).innerHTML = "";
            firebase.database().ref('users_data').once('value',(allData)=>{
                allData.forEach(function(obj) {
                    console.log(obj.val())
                    uiController.dataToUi(obj.val());
                  });
              });
            
            console.log('.tableincome');
        },
        dataToUi:function(data){
            let data1,ele;
            if(data.type=='exp'){
                ele = 'tableexpanses';
                data1= `<tr id="${data.type}-${data.entry_id}-${data.value}"><td>${data.entry_id}</td><td>${data.desc}</td><td>${data.value}</td><td>${data.date}</td><td><button>delete</button></td></tr>`
            }
            else{
                ele = 'tableincome';
                data1= `<tr id="${data.type}-${data.entry_id}-${data.value}"><td>${data.entry_id}</td><td>${data.desc}</td><td>${data.value}</td><td>${data.date}</td><td><button>delete</button></td></tr>`
            }
            document.getElementById(ele).insertAdjacentHTML('beforeend',data1);   
        },
        clearfield : function(){
            document.querySelector(fieldsClass.desc).value="";
            document.querySelector(fieldsClass.amt).value="";      
            document.querySelector(fieldsClass.desc).focus();    
        },
        setBudget:function(data){
            console.log(data);
            document.querySelector(fieldsClass.tcase).innerHTML=data.budget;
            document.querySelector(fieldsClass.tincome).innerHTML=data.income;
            document.querySelector(fieldsClass.texpanse).innerHTML=`${data.expanse}(${data.percentage}%)`;
        },
        deleteUi:function(data){
            let el = document.getElementById(data);
            el.parentNode.removeChild(el);
        }
    };

})();

    // const  dataToUi = (data) => {   
    //              let data1,ele;
    //                 if(data.type=='exp'){
    //                     ele = 'tableexpanses';
    //                     data1= `<tr id="${data.type}-${data.entry_id}-${data.value}"><td>${data.entry_id}</td><td>${data.desc}</td><td>${data.value}</td><td>${data.date}</td><td><button>delete</button></td></tr>`
    //                 }
    //                 else{
    //                     ele = 'tableincome';
    //                     data1= `<tr id="${data.type}-${data.entry_id}-${data.value}"><td>${data.entry_id}</td><td>${data.desc}</td><td>${data.value}</td><td>${data.date}</td><td><button>delete</button></td></tr>`
    //                 }
    //                 document.getElementById(ele).insertAdjacentHTML('beforeend',data1);
    // }

let controller = (function(uictrl){
 
    const fields = uictrl.getfieldsClass();
 
     const deleteData = (event) =>{
         let item;
         item= event.target.parentNode.parentNode.id;
         if(item){
             console.log(item)
             let data = item.split('-');
             let id = data[1]
             console.log(id)
            var adaRef = firebase.database().ref('users_data/'+id);
                adaRef.remove()
                .then(function() {
                    console.log("remove done")
                })
                .catch(function(error) {
                    console.log("Remove failed: " + error.message)
                });

             uictrl.deleteUi(item);
     }
 }
     const updateBudget = (data)=>{
        //  uictrl.setBudget(budgetctrl.calculateBudget(data));
     }
 
     const addData = () =>{
         let newdata;
         const fields = uictrl.getfieldsClass();
         const data = uictrl.getinput();
         if(data.amt != "" && data.desc != "" && data.amt>0){
                let userId  = 'entry_'+Math.floor(Date.now() / 1000);
                var adaRef = firebase.database().ref('users_data/'+userId);
                // var newMessageRef = messagesRef.push();
                adaRef.set({
                    entry_id:userId,
                    type:data.type,
                    desc : data.desc,
                    value : data.amt,
                    date : new Date().getDate()+'/'+new Date().getMonth()+'/'+new Date().getFullYear()
                });
                const datac = {
                    entry_id:userId,
                    type:data.type,
                    desc : data.desc,
                    value : data.amt,
                    date : new Date().getDate()+'/'+new Date().getMonth()+'/'+new Date().getFullYear()
                }
                uictrl.dataToUi(datac)
            //  uictrl.showdata(); 
             uictrl.clearfield();
          }else{
            //alert("fill first");
         }
     }
 
     document.querySelector('#submit').addEventListener('click',addData);
     document.addEventListener('keyup',function(event){
         if(event.keyCode==13){
             addData();
         }
     });
 
     document.querySelector(fields.main).addEventListener('click',deleteData);
 
 })(uiController);
 uiController.showdata()
//   <script src="https://www.gstatic.com/firebasejs/8.2.6/firebase-app.js"></script>

//   <!-- TODO: Add SDKs for Firebase products that you want to use
//        https://firebase.google.com/docs/web/setup#available-libraries -->
  
//   <script>
//     // Your web app's Firebase configuration
//     var firebaseConfig = {
//       apiKey: "AIzaSyDBARQkJXCiELqwdaq6wAEiJ1SJdKyLpDQ",
//       authDomain: "badget-7d2e5.firebaseapp.com",
//       databaseURL: "https://badget-7d2e5-default-rtdb.firebaseio.com",
//       projectId: "badget-7d2e5",
//       storageBucket: "badget-7d2e5.appspot.com",
//       messagingSenderId: "388376641692",
//       appId: "1:388376641692:web:e74eff1e379f24e43eed59"
//     };
//     // Initialize Firebase
//     firebase.initializeApp(firebaseConfig);
//   </script>

