const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=2&api_key=9bc4ce07-f1ef-402c-bc64-9e6c10415ff2";
const API_URL_FAVOURITES = "https://api.thecatapi.com/v1/favourites";
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

const API = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/',
});
API.defaults.headers.common['X-API-KEY'] = '9bc4ce07-f1ef-402c-bc64-9e6c10415ff2';

const spanError = document.getElementById('error');

async function loadRandomMichis() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();

    console.log('random', data);
    if (res.status !==200) {
        spanError.innerHTML = `Hubo un error: ${res.status}`;
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');

        img1.src = data[0].url;
        img2.src = data[1].url;
        btn1.onclick = () => saveFavouriteMichis(data[0].id);
        btn2.onclick = () => saveFavouriteMichis(data[1].id);
    }
}

async function loadFavouritesMichis() {
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': '9bc4ce07-f1ef-402c-bc64-9e6c10415ff2',
        }
    });
    const data = await res.json();

    console.log('favoritos', data);

    if (res.status !==200) {
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`;
    } else {
        const section = document.getElementById('favoritesMichis');
        section.innerHTML = "";

        const h2 = document.createElement("h2");
        const h2Text = document.createTextNode("Gatitos favoritos");
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(element => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createElement('img');
            const div = document.createElement('div');
            
            btnText.src = ('./corazon-como-boton-quitar-simbolo.png');
            btn.appendChild(btnText);
            div.appendChild(btn);            
            btn.onclick = () => deleteFavouriteMichi(element.id);
            img.src = element.image.url;
            img.width = 150;
            img.id = 'mainImg';
            div.id = 'quitarMichi';
            article.appendChild(img);
            article.appendChild(div);
            section.appendChild(article);
        });
    }

}

async function saveFavouriteMichis(id) {
    // const res = await fetch(API_URL_FAVOURITES, {
    //     method: 'POST',
    //     headers: {
    //         'X-API-KEY': '9bc4ce07-f1ef-402c-bc64-9e6c10415ff2',
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     }),
    // })
    // const data = await res.json();

    // console.log('save', res);

    const { data, status } = await API.post('/favourites', {
        image_id: id,
    });

    if (status !==200) {
        spanError.innerHTML = `Hubo un error: ${status} ${data.message}`;
    } else {
        console.log("Michi guardado en favoritos");
        loadFavouritesMichis();
    }
}

async function deleteFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': '9bc4ce07-f1ef-402c-bc64-9e6c10415ff2',
        }
    });
    const data = await res.json();

    if (res.status !==200) {
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`;
    } else {
        console.log("Michi eliminado de favoritos");
        loadFavouritesMichis();
    }
}

async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': '9bc4ce07-f1ef-402c-bc64-9e6c10415ff2',
        },
        body: formData,
    });
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error :" + res.status + data.message;
        console.log({data})
    } else {
        console.log('Fo subida con exito');
        console.log({data});
        console.log(data.url);
        saveFavouriteMichis(data.id);
    }
}

loadRandomMichis();
loadFavouritesMichis();