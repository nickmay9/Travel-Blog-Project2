async function editFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="postTitle"]').value.trim();
  const post_text = document.querySelector('textarea[name="postBody"]').value.trim();
  const city = document.querySelector('input[name="postCity"]').value.trim();
  const country = document.querySelector('input[name="postCountry"]').value.trim();
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  if (title && post_text && city && country) {
    let lat, long;
    const cityData = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=pjtMs45lJi90EGCVfaBEDChiCmQFtGmI&location=${city}+${country}`).then(data => {
      return data.json();
    }).then(data => {
      [lat, long] = [data.results[0].locations[0].latLng.lat, data.results[0].locations[0].latLng.lng];
    });

    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        post_text,
        long,
        lat,
        city,
        country
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }

  }
}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);