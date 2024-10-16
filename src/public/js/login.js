const inputEmail=document.getElementById("email")
const inputPassword=document.getElementById("password")
const btnSubmit=document.getElementById("btnSubmit")
const divMensajes=document.getElementById("mensajes")

const params=new URLSearchParams(window.location.search)
let mensaje=params.get("mensaje")
if(mensaje){
    divMensajes.textContent=mensaje
    setTimeout(() => {
        divMensajes.textContent=""
    }, 3000);
}


btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()
    let email=inputEmail.value 
    let password=inputPassword.value 
    if(!email || !password){
        alert("Complete los datos")
        return 
    }
    // validaciones x cuenta del alumno... 
    let body={
        email, password
    }

    let respuesta=await fetch("/api/sessions/login", {
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
        // window.location.href=`/perfil?mensaje=Registro exitoso para ${datos.nuevoUsuario.email}`
        window.location.href=`/perfil`
    }
})
