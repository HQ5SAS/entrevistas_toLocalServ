const fs = require('fs');
const { exportsDB } = require("./db");
const con = exportsDB();

//let sqlVideo = "SELECT aplicar_convocatorias_id, 'pregunta1','pregunta2','pregunta3','pregunta4','pregunta5','pregunta6','pregunta7' FROM defaultdb.entrevistas where ruta IS NULL OR ruta = ''"
let sqlVideo = "SELECT `aplicar_convocatorias_id`, `pregunta1`,`pregunta2`,`pregunta3`,`pregunta4`,`pregunta5`,`pregunta6`,`pregunta7` FROM defaultdb.entrevistas where ruta IS NULL OR ruta = ''"

const ruta="/mnt/entrevistavirtual/";

con.query(sqlVideo, async function (err, result){
    //si toma error imprimir en consola
    if(err) console.log(err); 
    for(index in result){
        var id_=result[index]["aplicar_convocatorias_id"];
        console.log(id_)
        //para cada pregunta existente por entrevista crea ruta según parametrización (rutaDigitalocean/idRegistro_numeroPregunta.mp4)
       try{
        for(var i= 1;i< 8;i++  ){
            var pregunta="pregunta"+i.toString()
            var base64Video_ = result[index][pregunta];
           // base64Video_=JSON.stringify(base64Video_)
            //console.log(typeof(base64Video_))
            if(typeof(base64Video_) != "object"){
                Video_toVolume = base64Video_.replace(/^data:(.*?);base64,/, ""); // 
                Video_toVolume = Video_toVolume.replace(/ /g, '+'); // 
            
                fs.writeFile(`/mnt/entrevistavirtual/`+id_+"_"+i+".mp4" , Video_toVolume, 'base64', function(err) {
                    console.log(err);
                });
            }
          
        }
        var sqlUpdate = "UPDATE `entrevistas` SET `ruta`= '"+ ruta+ "' WHERE (`aplicar_convocatorias_id` = '" + id_ + "');";
        await con.query(sqlUpdate, function (err, result) {
              if (err) throw err;
              console.log("video guardado en db");
            });
       }
       catch(err){
        console.log(err);
       }
        
  
      };
})

