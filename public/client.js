document.addEventListener(`DOMContentLoaded`, _ => {

  const update = document.querySelector('#update-button')
  const trash = document.querySelector('#delete-button')

  /* update button */

  update.addEventListener('click', _ => {

    fetch('/update', {

      method:'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player:'WAHHH',
        roll:'5000000000',
        quote:'hahahahahahahhahahahahahahahaha'
      })
    })
    .then( response => {
      
      if( response.ok ) return response.json()
    })
    .then( okay => {

      console.log(okay)
      window.location.reload(true)
    })
  })

  /* delete button */

  trash.addEventListener(`click`, _ => {

    fetch(`/delete`, {
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ player:'WAHHH' })
      })
      .then( res => { if(res.ok) return res.json })
      .then( okay => { window.location.reload() })
  })
})