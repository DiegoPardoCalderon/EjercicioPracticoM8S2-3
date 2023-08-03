const express  = require('express');
const app = express();
const { v4: uuid} = require('uuid');
const port = 3000;

app.use(express.json())

app.listen(port, () => console.log(`Servicio Ejecutado por el puerto ${port}`));

const dispositivos = []


//Metodo para listar todos los dispositivos(GET)
app.get('/dispositivos', (request, response) =>{
  response.json({ success: true, message: 'Listado de dispositivos', data: dispositivos });
})

//Metodo para listar un dispositivo por id(GET)
app.get('/dispositivos/:id', (request, response) =>{
  const id = request.params.id;
  const fila = dispositivos.find(item => String(item.id) === String(id))
  if(!fila) {
    return response.status(404).json({succes: false, message: 'Dispositivo no encontrado'});
  }
  response.json({ success: true, message: 'Consulta exitosa', data: fila });
});

//Metodo para Registrar dispositivos(POST)
app.post('/dispositivos', (request, response) => {
  const id = uuid().slice(0,8)
  const registrar = { id, ...request.body}
  dispositivos.push(registrar)
  response.status(201).json({succes: true, message: 'Registro de Dispositivo exitoso'});
})

//Metodo para modificar toda la data de un registro(PUT)
app.put('/dispositivos/:id', (request, response) => {
  const id = request.params.id;
  const indice = dispositivos.findIndex(item => String(item.id) === String(id));
  if(!request.body.nombre){
    return response.status(404).json({ succes: false, message: 'Falta ingresar el nombre'});
  }
  if(!request.body.tipo_dispositivo){
    return response.status(400).json({ succes: false, message:'Falta ingresar el tipo de Dispositivo'});
  }
  if (indice === -1) {
    response.status(404).json({ succes: false, message:'Dispositivo no encontrados'}); 
  }
  const actualizar = { id, ...request.body }
  dispositivos[indice] = actualizar;
  response.json({ succes: true, message: 'Dispositivo actualizado con exito', data: actualizar });

})

//Metodo para eliminar un registro por id(DELETE)
app.delete('/dispositivos/:id', (request, response) => {
  const id = request.params.id
  const indice = dispositivos.findIndex(item => String(item.id) === String(id));
  if(indice !== -1) {
    return response.status(404).json({succes: false, message: 'Dispositivo no encontrado'});
  }
  const eliminado = dispositivos.splice(indice, 1)
  response.json({succes: true, message: 'Dispositivo eliminado con exito', data: eliminado});
})

//Metodo para modificar SOLO un registro por id(PATCH)
app.patch('/dispositivos/:id', (request, response) =>{
    const id = request.params.id
    const indice = dispositivos.findIndex(item => String(item.id) === String(id))
    if(!request.body.nombre && !request.body.tipo_dispositivo){
        return response.status(400).json({ success: false, message: 'Se debe indicar al menos un campo a actualizar' })
    }
    if(indice === -1){
        return response.status(404).json({ success: false, message: 'No encontrado' })
    }
    const actualizado = dispositivos[indice] = {
        ...dispositivos[indice],
        nombre: request.body.nombre || dispositivos[indice].nombre,
        tipo_dispositivo: request.body.tipo_dispositivo || dispositivos[indice].tipo_dispositivo
    }
    response.json({ success: true, message: 'Actualizado PATCH', data: actualizado })
})