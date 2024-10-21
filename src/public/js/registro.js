const inputNombre=document.getElementById("nombre")
const inputApellido=document.getElementById("apellido")
const inputEmail=document.getElementById("email")
const inputEdad=document.getElementById("edad")
const inputPassword=document.getElementById("password")
const btnSubmit=document.getElementById("btnSubmit")
const divMensajes=document.getElementById("mensajes")

btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()
    let nombre=inputNombre.value 
    let apellido=inputApellido.value
    let email=inputEmail.value
    let edad=inputEdad.value
    let password=inputPassword.value 
    if(!nombre || !email || !password || !edad || !apellido){
        alert("Complete los datos")
        return 
    }
    // validaciones x cuenta del alumno... 
    let body={
        nombre, email, password, edad, apellido
    }

    let respuesta=await fetch("/api/sessions/registro", {
        method:"post", 
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    })
    let datos=await respuesta.json()
    if(respuesta.status>=400){
        divMensajes.textContent=datos.error
        setTimeout(() => {
            divMensajes.textContent=""
        }, 3000);
    }else{
        window.location.href=`/login?mensaje=Registro exitoso para ${datos.nuevoUsuario.email}`
    }
})
