import {useEffect} from 'react'

function App(){
  useEffect(()=>{
    fetch('/api/')
     .then(res=>res.json())
     .then(data=>console.log(data))
     .catch(err=>console.log(err))
  },[])

  return(
    <div>
      <h1>hello</h1>
    </div>
  )
}

export default App;
