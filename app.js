const express = require("express");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const bp = require("body-parser");
const uri =
  "mongodb+srv://dbUser:12345@cluster0.g1to2iq.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch {
    await client.close();
  }
}
run().catch(console.dir);

async function searchUser(filter) {
  let result;
  if (filter) {
    result = await client.db("Data").collection("Users").findOne(filter);
  } else {
    let cursor = client.db("Data").collection("Users").find();
    result = await cursor.toArray();
  }
  if (result) {
    return result;
  } else {
    return null;
  }
}

async function insertUser(user) {
  const result = await client.db("Data").collection("Users").insertOne(user);
  if (result) {
    return result;
  } else {
    return null;
  }
}

async function updateUser(updateFields, id) {
  const result = await client
    .db("Data")
    .collection("Users")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
  if (result) {
    return result;
  } else {
    return null;
  }
}

async function searchPlaylists(filter) {
  let result;
  if (filter) {
    result = await client.db("Data").collection("Playlists").findOne(filter);
  } else {
    let cursor = client.db("Data").collection("Playlists").find();
    result = await cursor.toArray();
  }
  if (result) {
    return result;
  } else {
    return null;
  }
}

async function searchMusics(filter) {
  let result;
  if (filter) {
    result = await client.db("Data").collection("musicas").findOne(filter);
  } else {
    let cursor = client.db("Data").collection("musicas").find();
    result = await cursor.toArray();
  }
  if (result) {
    return result;
  } else {
    return null;
  }
}

const port = 3000;

// let arrayData = {
//   users: [
//     {
//       id: 1,
//       name: "Saulo",
//       email: "saulo@gmail.com",
//       password: 1234,
//       gender: "Não Binario",
//       playlists: [
//         {
//           id: 1,
//           title: "playlist aleatoria",
//           musicas: [
//             { id: 1, title: "musica aleatoria", src: "/mp3/001.mp3" },
//             { id: 2, title: "musica aleatoria 2", src: "/mp3/002.mp3" },
//           ],
//         },
//       ],
//     },
//   ],
//   playlistPublic: [
//     {
//       id: 1,
//       title: "Playlist publica",
//       musicas: [
//         { id: 1, title: "musica publica", src: "/mp3/001.mp3" },
//         { id: 2, title: "musica publica 2", src: "/mp3/002.mp3" },
//       ],
//     },
//   ],
//   musicas: [
//     { id: 1, title: "musica publica", src: "/mp3/001.mp3" },
//     { id: 2, title: "musica publica 2", src: "/mp3/002.mp3" },
//     { id: 3, title: "musica publica 3", src: "/mp3/003.mp3" },
//   ],
// };

//--------------------- Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let response = {};
  run().catch(console.dir);
  let user = await searchUser({ email: email, password: password });
  console.log(user);
  if (user) {
    response = {
      code: 200,
      msg: "Logado com sucesso!!!",
      data: user,
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
app.get("/users", async (req, res) => {
  const users = await searchUser();
  let response = {
    code: 200,
    data: users,
  };
  res.send(response);
});

//--------------------- Inserir usuários
app.post("/users", async (req, res) => {
  let data = req.body;
  await insertUser({ ...data, playlists: [] });
  let response = {
    code: 200,
    msg: "Usuário inserido com sucesso!!! ",
  };
  res.send(response);
});

//--------------------- Editar usuários
app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  console.log(body);

  let result = await updateUser(body, id);
  console.log(result);

  // let usuIndex = arrayData.users.findIndex((e) => e.id == id);
  // console.log("hsbsj", usuIndex);
  // keys.forEach((key) => {
  //   arrayData.users[usuIndex][key] = body[key];
  // });
  let response = {
    code: 200,
    msg: "Usuário editado com sucesso!!! ",
  };
  res.send(response);
});

app.get("/playlists", async (req, res) => {
  const { title } = req.query;
  const filter = { title: title };
  const playlists = await searchPlaylists(filter);
  let response = {
    code: 200,
    data: playlists,
  };
  res.send(response);
});

//--------------------- Visualizar playlist de usuários
app.get("/users/playlists/:idUsu", async (req, res) => {
  const { idUsu } = req.params;
  let usuario = await searchUser({ _id: new ObjectId(idUsu) });
  //let usuario = arrayData.users.find((e) => e.id == idUsu);
  console.log(usuario);
  let response = {
    code: 200,
    data: usuario.playlists,
  };
  res.send(response);
});

//--------------------- Adicionar nova playlist de usuários
app.post("/users/playlists/:idUsu", async (req, res) => {
  const { idUsu } = req.params;
  const playlist = req.body;

  let user = await searchUser(new ObjectId(idUsu));
  let body = { ...user, playlists: [...user.playlists, playlist] };
  let result = await updateUser(body, new ObjectId(idUsu));

  // let usuario = arrayData.users.find((e) => e.id == idUsu);
  // let idPlaylist = usuario.playlists.length + 1;
  // let idMu = 1;
  // playlist.musicas.forEach((musica, index) => {
  //   musica.id = index + 1;
  // });
  // usuario.playlists.push({ id: idPlaylist, ...playlist });

  let response = {
    code: 200,
    msg: `Playlist '${playlist.title}' adicionada com sucesso!!!`,
  };
  res.send(response);
});

//--------------------- Deletar playlist de usuários
app.delete("/users/playlists/:idUsu/:index", async (req, res) => {
  const { idUsu, index } = req.params;

  let user = await searchUser(new ObjectId(idUsu));
  if (user.playlists.length - 1 >= index) {
    let newPlaylists = user.playlists.splice(index, 1);
    let body = { ...user, playlists: newPlaylists };
    console.log("asdas", newPlaylists);
    let result = await updateUser(body, new ObjectId(idUsu));
    res.send(`Música '${newPlaylists[0].title}' deletada com sucesso!!!`);
  } else {
    res.send("Playlist não existe");
  }
});

// ------------------- Visualizar musicas
app.get("/musicas", async (req, res) => {
  const { title } = req.query;
  const filter = { title: title };
  console.log(filter);
  let result = await searchMusics(filter);
  let response = {
    code: 200,
    data: result,
  };
  res.send(response);
});

//--------------------- Visualizar musicas da playlist do usuário
app.get("/musicas/:idUsu/:indexPlaylist", async (req, res) => {
  const { idUsu, indexPlaylist } = req.params;
  let user = await searchUser(new ObjectId(idUsu));

  let musicas = user.playlists[indexPlaylist].musicas;
  console.log(musicas);
  let response = {
    code: 200,
    data: musicas,
  };
  res.send(response);
});

//--------------------- Adicionar uma musica na playlist do usuário
app.post("/musicas/:idUsu/:indexPlaylist", async (req, res) => {
  const { idUsu, indexPlaylist } = req.params;
  const musica = req.body;
  let user = await searchUser(new ObjectId(idUsu));
  let playlist = user.playlists[indexPlaylist];
  playlist.musicas.push(musica);
  user.playlists[indexPlaylist] = playlist;
  let body = { ...user, playlists: [...user.playlists] };
  let result = await updateUser(body, new ObjectId(idUsu));

  let response = {
    code: 200,
    msg: `Musica '${musica.title}' adicionada com sucesso!!!`,
  };
  res.send(response);
});

//--------------------- Deletar musicas da playlist do usuário
app.delete("/musicas/:idUsu/:indexPlaylist/:indexMusica", async (req, res) => {
  const { idUsu, indexPlaylist, indexMusica } = req.params;
  let user = await searchUser(new ObjectId(idUsu));
  if (
    user.playlists.length - 1 >= indexPlaylist &&
    user.playlists[indexPlaylist].musicas.length
  ) {
    let playlist = user.playlists;
    console.log("aaa", user.playlists[indexPlaylist].musicas);
    let newmusicas = user.playlists[indexPlaylist].musicas;
    let deletedMusica = newmusicas.splice(indexMusica, 1);
    console.log(newmusicas);

    console.log(playlist);
    playlist[indexPlaylist].musicas = newmusicas;

    let body = { ...user, playlists: playlist };
    let result = await updateUser(body, new ObjectId(idUsu));
    res.send(`Música '${deletedMusica[0].title}' deletada com sucesso!!!`);
  } else {
    res.send("Playlist não existe");
  }

  let response = {
    code: 200,
    msg: `Música '${newmusicas[0].title}' deletada com sucesso!!!`,
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
