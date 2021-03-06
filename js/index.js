let toile = document.createElement("canvas");
let ctx = toile.getContext("2d");
document.body.appendChild(toile);
let L = (toile.width = 64), H = (toile.height = 64);
let zoom = 6;
toile.style.width = L * zoom + "px";
toile.style.width = H * zoom + "px";

let curseur = {
  pos: {
    x: 0,
    y: 0
  },
  id: 1,
  mode: "pen",
  actif: false
};

toile.addEventListener("pointerdown", event => curseurDown(event), false);
document.addEventListener("pointerup", event => curseurUp(event), false);
toile.addEventListener("pointermove", event => curseurMouvement(event), false);

// Curseur
function curseurDown(e) {
  curseur.actif = true;
}

function curseurUp(e) {
  curseur.actif = false;
}

function curseurMouvement(e) {
  curseur.pos.x = e.pageX - toile.offsetLeft;
  curseur.pos.y = e.pageY - toile.offsetTop;
}

function tableau2D(largeur, hauteur, value) {
  var tableau = new Array(hauteur).fill(value);
  for (var i = 0; i < tableau.length; i++) {
    tableau[i] = new Array(largeur).fill(value);
  }
  return tableau;
}
let tableau = tableau2D(L + 1, H + 1, 0);

couleurs = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

function dessinerSable(x, y, id, largeur) {
  // x
  if (y > 0 && y < H) {
    for (let axeX = 0; axeX < largeur; axeX++) {
      creerSable(x + axeX, y, id);
    }
  }
}

function effacerSable(x, y, largeur) {
  // x
  for (let axeX = 0; axeX < largeur; axeX++) {
    for (let axeY = 0; axeY < largeur; axeY++) {
      if (y + axeY < H && x + axeX < L) {
        tableau[y + axeY][x + axeX] = 0;
      }
    }
  }
}

function creerSable(x, y, id) {
  if (tableau[y][x] === 0) {
    tableau[y][x] = id;
  }
}

function renduSable() {
  //[y][x]
  for (var y = H - 1; y >= 0; y--) {
    for (var x = L - 1; x >= 0; x--) {
      let id = tableau[y][x];
      if (id > 0) {
        ctx.fillStyle = couleurs[id - 1];
        ctx.fillRect(x, y, 1, 1);
      }
      // logique
      if (tableau[y][x] > 0 && y < H - 1) {
        // si cellule pleine
        if (tableau[y + 1][x] === 0) {
          // si la cellule en dessous est vide, cette cellule peut tomber.
          tableau[y][x] = 0;
          tableau[y + 1][x] = id;
        } else if (tableau[y + 1][x + 1] === 0) {
          tableau[y][x] = 0;
          tableau[y + 1][x + 1] = id;
        } else if (tableau[y + 1][x - 1] === 0) {
          tableau[y][x] = 0;
          tableau[y + 1][x - 1] = id;
        }
      }
    }
  }
}

function boucle() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, L, H);
  renduSable();
  if (curseur.actif) {
    let x = Math.floor(curseur.pos.x / zoom);
    let y = Math.floor(curseur.pos.y / zoom);
    if (curseur.mode === "pen") {
      dessinerSable(x, y, curseur.id, 4);
    } else {
      effacerSable(x, y, 6);
    }
  }
  requestAnimationFrame(boucle);
}
boucle();

// interface

let boiteOutils = document.createElement("div");
boiteOutils.id = "outils";
document.body.appendChild(boiteOutils);

boiteOutils.innerHTML +=
  "<h2>Sand simulator</h2><p>Use your cursor to add sand</p>";

let penBTN = document.createElement("input");
penBTN.type = "button";
penBTN.value = "Pen";
penBTN.onclick = function() {
  curseur.mode = "pen";
};
boiteOutils.appendChild(penBTN);

let eraseBTN = document.createElement("input");
eraseBTN.type = "button";
eraseBTN.value = "Eraser";
eraseBTN.onclick = function() {
  curseur.mode = "erase";
};
boiteOutils.appendChild(eraseBTN);

let selectList = document.createElement("select");
selectList.onchange = function() {
  curseur.id = selectList.selectedIndex + 1;
};

boiteOutils.appendChild(selectList);

for (var i = 0; i < couleurs.length; i++) {
  let option = document.createElement("option");
  option.value = i;
  option.text = couleurs[i];
  option.style.background = couleurs[i];
  option.style.color = "rgba(0,0,0,0.8)";
  option.style.fontWeight = "bold";
  selectList.appendChild(option);
}