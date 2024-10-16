const inputNombre=document.getElementById("nombre")
const inputEmail=document.getElementById("email")
const inputPassword=document.getElementById("password")
const btnSubmit=document.getElementById("btnSubmit")
const divMensajes=document.getElementById("mensajes")

btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()
    let nombre=inputNombre.value 
    let email=inputEmail.value 
    let password=inputPassword.value 
    if(!nombre || !email || !password){
        alert("Complete los datos")
        return 
    }
    // validaciones x cuenta del alumno... 
    let body={
        nombre, email, password
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
