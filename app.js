const express = require("express");
const app = express();
const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const port = 3000;

let id = 2;

let arrayData = {
  users: [
    {
      id: 1,
      name: "Saulo",
      email: "saulo@gmail.com",
      password: 1234,
      gender: "Não Binario",
      playlists: [
        {
          id: 1,
          title: "playlist aleatoria",
          musicas: [
            { id: 1, title: "musica aleatoria", src: "/mp3/001.mp3" },
            { id: 2, title: "musica aleatoria 2", src: "/mp3/002.mp3" },
          ],
        },
      ],
    },
  ],
};

//--------------------- Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let response = {};
  let user = arrayData.users.find(
    (e) => e.email === email && e.password === password
  );
  if (user) {
    response = {
      code: 200,
      msg: "Logado com sucesso!!!",
    };
  } else {
    response = {
      code: 401,
      msg: "Email ou senha incorretos.",
    };
  }

  res.send(response);
});

//--------------------- Vizualizar usuários
app.get("/users", (req, res) => {
  const users = arrayData.users;
  let response = {
    code: 200,
    data: users,
  };
  res.send(response);
});

//--------------------- Inserir usuários
app.post("/users", (req, res) => {
  let data = req.body;
  console.log(data);
  arrayData.users.push({ id: id, ...data, playlists: [] });
  id++;
  let response = {
    code: 200,
    msg: "Usuário inserido com sucesso!!! ",
  };
  res.send(response);
});

//--------------------- Editar usuários
app.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const keys = Object.keys(body);
  console.log(keys);
  let usuIndex = arrayData.users.findIndex((e) => (e.id = id));
  keys.forEach((key) => {
    arrayData.users[usuIndex][key] = body[key];
  });
  let response = {
    code: 200,
    msg: "Usuário editado com sucesso!!! ",
    data: arrayData.users[usuIndex],
  };

  res.send(response);
});

//--------------------- Vizualizar playlist de usuários
app.get("/playlists/:idUsu", (req, res) => {
  const { idUsu } = req.params;
  let usuario = arrayData.users.find((e) => e.id == idUsu);
  let response = {
    code: 200,
    data: usuario.playlists,
  };
  res.send(response);
});


//--------------------- Adicionar nova playlist de usuários
app.post("/playlist/:idUsu", (req, res) => {
  const { idUsu } = req.params;
  const playlist = req.body;

  let usuario = arrayData.users.find((e) => e.id == idUsu);
  let idPlaylist = usuario.playlists.length + 1;
  let idMu = 1;
  playlist.musicas.forEach((musica, index) => {
    musica.id = index + 1;
  });
  usuario.playlists.push({ id: idPlaylist, ...playlist });

  let response = {
    code: 200,
    msg: `Playlist '${playlist.title}' adicionada com sucesso!!!`,
  };
  res.send(response);
});

//--------------------- Vizualizar musicas da playlist do usuário
app.get("/musicas/:idUsu/:idPlaylist", (req, res) => {
  const { idUsu, idPlaylist } = req.params;
  let usuario = arrayData.users.find((e) => e.id == idUsu);
  let playlist = usuario.playlists.find((e) => e.id == idPlaylist);
  let response = {
    code: 200,
    data: playlist,
  };
  res.send(response);
});

//--------------------- Adicionar uma musica na playlist do usuário
app.post("/musicas/:idUsu/:idPlaylist", (req, res) => {
  const { idUsu, idPlaylist } = req.params;
  const musica = req.body;

  let usuario = arrayData.users.find((e) => e.id == idUsu);
  let playlistIndex = usuario.playlists.findIndex((e) => e.id == idPlaylist);
  const idMusica = usuario.playlists[playlistIndex].musicas.length + 1;

  usuario.playlists[playlistIndex].musicas.push({ id: idmusica, ...musica });

  let response = {
    code: 200,
    msg: `Musica '${musica.title}' adicionada com sucesso!!!`,
  };
  res.send(response);
});

//--------------------- Deletar musicas da playlist do usuário
app.delete("/musicas/:idUsu/:idPlaylist/:idMusica", (req, res) => {
  const { idUsu, idPlaylist, idMusica } = req.params;
  let indexMusica = idMusica - 1;
  let usuario = arrayData.users.find((e) => e.id == idUsu);
  let playlist = usuario.playlists.find((e) => e.id == idPlaylist);
  let musica = playlist.musicas.splice(indexMusica, 1);
  console.log(musica[0]);
  let response = {
    code: 200,
    msg: `Música '${musica[0].title}' deletada com sucesso!!!`,
  };
  res.send(response);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//Login
// {
//      "email":"saulo@gmail.com",
//      "password":1234
// }

//Adicionar Usuário
// {
//     "name":"TEST",
//      "email":"TEST",
//       "password":"TEST",
//        "gender":"TEST"
// }

//Editar Usuário
// {
//     "name":"NAME MUDADO",
//      "email":"EMAIL MUDADO",
//        "gender":"GENDER MUDADO"
// }

//Adicionar musica
// {
//     "title": "musica aleatoria 3",
//     "src": "/mp3/003.mp3" 
//  }

//Adicionar playlist
// {
     
//   "title": "Nova Playlist",
//   "musicas": [
//                 {  "title": "nova musica", "src": "/mp3/001.mp3" },
//                 {  "title": "nova musica 2", "src": "/mp3/002.mp3" }
//              ]
// }
