let budgetController = (function(){
    let tbudget=0,texpanse=0,tincome=0,tpercentage;
    let income = function(id,desc,value){
        this.id=id;
        this.desc =desc;
        this.value= value
    }
    let expanse = function(id,desc,value,per){
        this.id=id;
        this.desc =desc;
        this.value= value;
        this.per = per
    }
    const data = {
        allitem:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        }
    }
    return {
            additem:function(type,desc,value){
                let newitem,id=0;
                let per;
                if(data.allitem[type].length>0){
                    id = data.allitem[type][data.allitem[type].length-1].id+1;
                }else{
                    id=0;
                }
                if(type==='inc'){
                    newitem = new income(id,desc,value);
                }
                else{
                    if(tincome==0){
                        per=0;
                    }else{
                        per =Math.floor((value/tincome)*100);
                        if(per>100){
                            per = 100-per;
                        }    
                    }
                    newitem = new expanse(id,desc,value,per);
                }
                data.allitem[type].push(newitem);
                return newitem;
            },
            testing:function(){
                console.log(data);
            },
            calculateBudget:function(data){
                console.log(data);
                
                if(data.type=='exp'){
                    tbudget -= data.amt;
                    texpanse += data.amt; 
                    if(tincome==0){
                        tpercentage=0; 
                    }else{
                    tpercentage =Math.floor((texpanse/tincome)*100);
                    if(tpercentage>100){tpercentage=100-tpercentage;}    
                }
                }else{
                   tbudget += data.amt;
                   tincome += data.amt; 
                   if(tincome==0){
                    tpercentage=0; 
                     }else{
                    tpercentage =Math.floor((texpanse/tincome)*100);
                    if(tpercentage>100){tpercentage=100-tpercentage;}     
                }
                    }
                return {
                    budget:tbudget,
                    expanse:texpanse,
                    income:tincome,
                    percentage:tpercentage 
                }
            },
            deleteRow:function(type,id){
                let index;
                let ids = data.allitem[type].map(function(value){
                        return value.id;
                    });
                    index = ids.indexOf(id);
                    if(index !== -1){
                        data.allitem[type].splice(index,1);
                        console.log("done");
                    }
            },
           
            updateBudget:function(type,val){
                if(type =='inc'){
                    console.log("rdf");
                    tbudget = tbudget-val;
                    tincome = tincome-val; 
                    if(tincome==0){
                     tpercentage=0; 
                      }else{
                     tpercentage =Math.floor((texpanse/tincome)*100);}
                }else{
                    tbudget = tbudget+val;
                    texpanse = texpanse-val;
                    if(tincome==0){
                        tpercentage=0; 
                    }else{
                    tpercentage =Math.floor((texpanse/tincome)*100);}
                }
                return {
                    budget:tbudget,
                    expanse:texpanse,
                    income:tincome,
                    percentage:tpercentage 
                }
            }
       }
})();

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
        showdata:function(obj,type){
            let data,ele;
            if(type=='exp'){
                ele = fieldsClass.tableex;
                data= `<tr id="${type}-${obj.id}-${obj.value}"><td>${obj.id}</td><td>${obj.desc}</td><td>${obj.value}(${obj.per}%)</td><td>${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}</td><td><button>delete</button></td></tr>`
                console.log('ex'+data);  
                
                // document.querySelector(ele).insertAdjacentHTML('beforeend',53);
            }
            else{
                ele = fieldsClass.tablein;
                data= `<tr id="${type}-${obj.id}-${obj.value}"><td>${obj.id}</td><td>${obj.desc}</td><td>${obj.value}</td><td>${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}</td><td><button>delete</button></td></tr>`
                console.log(data);  
                // document.querySelector(ele).insertAdjacentHTML('beforeend',45);
            }
            document.getElementById(ele).insertAdjacentHTML('beforeend',data);
            console.log('.tableincome');
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

let controller = (function(budgetctrl,uictrl){
 
   const fields = uictrl.getfieldsClass();

    const deleteData = (event) =>{
        let item;
        item= event.target.parentNode.parentNode.id;
        if(item){
            let data = item.split('-');
            let type = data[0];
            let id = parseInt(data[1]);
            let val = parseInt(data[2]);
            budgetctrl.deleteRow(type,id);
            uictrl.deleteUi(item);
            let updatedData= budgetctrl.updateBudget(type,val);
            console.log(updatedData);
            uictrl.setBudget(updatedData);
    }
}
    const updateBudget = (data)=>{
        uictrl.setBudget(budgetctrl.calculateBudget(data));
    }

    const addData = () =>{
        let newdata;
        const fields = uictrl.getfieldsClass();
        const data = uictrl.getinput();
        if(data.amt != "" && data.desc != "" && data.amt>0){
            newdata= budgetctrl.additem(data.type,data.desc,data.amt);
            uictrl.showdata(newdata,data.type); 
            updateBudget(data);
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

})(budgetController,uiController);
