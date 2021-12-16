// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/***********************************LIBRERIAS********************************/
const serialPort = require('serialport')

/***********************************VARIABLES********************************/
let selectedPort =""
let mySerialPort;
const Readline = serialPort.parsers.Readline
/***********************************ELEMENTOS DEL DOM************************/
const dropdownPorts = document.getElementById('dropdown-ports');
const dropdownBtn = document.getElementById('dropdownMenuButton1')
const refreshBtn = document.getElementById('btn-refresh');
const connetionBtn = document.getElementById('btn-connection');
const desconnetionBtn = document.getElementById('btn-desconnection');

/****************************** FUNCIONES************************************/
// Obtiene la lista de los puertos disponibles en la PC
async function listSerialPorts() {
  await serialPort.list().then((ports, err) => {
    if(err) {
      alert(err.message)
      return    
    }   

    if (ports.length === 0) {
      alert('Ningun puerto encontrado')
    }
   
    ports.slice(0, 5).forEach(port => {
      console.log(port.path);
      dropdownPorts.insertAdjacentHTML('beforeend', `<li><a class="dropdown-item" href="#" onclick="getPort(this)">${port.path}</a></li>`)
    })   
})
}

// Obtiene el puerto seleccionado por el usuario
const getPort = (port) => {
  console.log("Get port");
  console.log(port.innerHTML);
  selectedPort = port.innerHTML;
  dropdownBtn.innerHTML= `<i class="fab fa-usb"></i>${selectedPort}`;
}

// Realiza la conexion con el puerto selecionado
const portConnection = () => {
  if (selectedPort == "") {
    alert("Seleccione un puerto");
  }
  else {
    mySerialPort = new serialPort(selectedPort, { baudRate: 9600}, function (err) {
      if (err) {
        alert("Error abriendo el puerto");
        return console.log('Error: ', err.message)
      }
      else {
        console.log("Conexion establecida")
        alert("Conexion establecida")
        connetionBtn.classList.add("d-none")
        desconnetionBtn.classList.remove("d-none")
      }
    })

    mySerialPort.write('main screen turn on', function(err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      console.log('message written')
    })

    // // Read data that is available but keep the stream in "paused mode"
    // port.on('readable', function () {
    //   console.log('Data:', port.read())
    // })

    // // Switches the port into "flowing mode"
    // port.on('data', function (data) {
    //   console.log('Data:', data)
    // })

    // Pipe the data into another stream (like a parser or standard out)
    const parser = mySerialPort.pipe(new Readline({ delimiter: '\r\n' }))    
    parser.on('data', console.log)
  }
}

// Realiza la desconexion del puerto
const portDesconnection = () => {
  mySerialPort.close()
  alert("Puerto cerrado")
  connetionBtn.classList.remove("d-none")
  desconnetionBtn.classList.add("d-none")
}
/***********************************LLAMADA A FUNCIONES *************************************/
// Refresca los puertos al hacer click en el boton de refresh
listSerialPorts();

/***********************************EVENTOS*************************************************/
refreshBtn.addEventListener("click", (event) => {
  dropdownPorts.innerHTML='';
  listSerialPorts();   
});

//   setTimeout(function listPorts() {
//     dropdownPorts.innerHTML='';
//     listSerialPorts();
//     setTimeout(listPorts, 2000);
// }, 2000);