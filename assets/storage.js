window.MethodStorage=(()=>{
    const KEY='metodoguia-v2';
    let available=true;
    function save(state){
        try{
            localStorage.setItem(KEY,JSON.stringify(state));
            available=true;
            return true
        }
        catch(e){
            available=false;
            return false
        }
    }
    function load(){
        try{
        const x=localStorage.getItem(KEY);
        return x?JSON.parse(x):null
        }
        catch(e){
            available=false;
            return null
        }
    }
    function clear(){
        try{
            localStorage.removeItem(KEY);
            return true
        }
        catch(e){
            available=false;
            return false
        }
    }
    return{
        save,load,clear,isAvailable:()=>available
    }
})();
