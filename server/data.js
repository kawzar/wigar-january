//settings are just variables that can be sent to the client from the server
//they are either related to the rooms or shared with the server 
module.exports.SETTINGS = {
    //if not specified by the url where is the starting point
    defaultRoom: "entrada",
    //minimum time between talk messages enforced by both client and server
    ANTI_SPAM: 1000,
    //shows up at first non lurking login
    INTRO_TEXT: "Hace click/tap hacia donde quieras moverte"
};

//miscellaneous assets to preload
module.exports.IMAGES = [
    ["logo", "LogoEvento.png"],
];

//miscellaneous sounds to preload
module.exports.SOUNDS = [
    ["beat1", "beat1.ogg"], //credit https://www.youtube.com/watch?v=ugLVpZm69DE
    ["beat2", "beat2.ogg"], // credit https://www.youtube.com/watch?v=dPdoxIz0w24
    ["beat3", "beat3.ogg"], //credit https://www.youtube.com/watch?v=XShEWT4MwJs
    ["DJStop", "DJStop.mp3"],
    ["patiomix", "patiomix.mp3"],
    ["chillgaming", "chillgaming.mp3"],
    ["cruisingalong", "cruisingalong.mp3"]
];

module.exports.ROOMS = {

    patio: {
        bg: "likelike-backyard.png",
        frames: 2,
        frameDelay: 30,
        avatarScale: 2.25,
        area: "Room_Backyard-CollisionAreas.png",
        tint: "#fdbe4e",
        pageBg: "#413830",
        bubblesY: 20,
        spawn: [38, 63, 108, 83],
        areaColors: {
            //h will be replaced by #
            hf40a0a: {
                cmd: "enter",
                room: "hall",
                label: "Volver adentro",
                point: [119, 69],
                enterPoint: [20, 90],
                obstacle: false
            },
        },
        things: {
            //spreadsheets only 1 row ok?
            harvey: {
                file: "harvey.png",
                frames: 2,
                frameDelay: 15,
                position: [101, 81],
                label: "Harvey",
                command: {
                    cmd: "text",
                    txt: "*Acaricias al perrito*",
                    align: "center",
                    lines: 1,
                    point: [101, 84]
                }
            },
            cat: {
                file: "Cat_NONameYet.png",
                frames: 2,
                frameDelay: 15,
                position: [12, 81],
                label: "Miau",
                command: {
                    cmd: "text",
                    txt: "-Miau!\n(gracias Gael por bautizarme)",
                    align: "center",
                    lines: 2,
                    point: [15, 84]
                }
            },
            tv: {
                file: "tv.png",
                frames: 2,
                frameDelay: 30,
                position: [41, 2],
                label: "Women Game Jam",
                command: {
                    cmd: "text",
                    txt: "Ver más sobre la WGJ",
                    align: "center",
                    lines: 1,
                    url: "https://www.youtube.com/playlist?list=PLxzJxbms4gxgF_tmwYHtzz6AQ_pd9_ecC",
                    point: [64, 44]
                }
            },
            gameOn: {
                file: "GameOn_Cartel.png",
                frames: 2,
                frameDelay: 30,
                position: [10, 2],
                label: "Game On!",
                command: {
                    cmd: "text",
                    txt: "Visitar la web de\nGame On! El arte en juego",
                    align: "center",
                    lines: 2,
                    url: "https://www.gameonxp.com/",
                    point: [20, 44]
                }
            },
            unicorn: {
                file: "Unicorn.png",
                frames: 2,
                frameDelay: 30,
                position: [79, 42],
                label: "Unicornio",
                command: {
                    cmd: "text",
                    txt: "Pride Rainbow Dash",
                    align: "center",
                    lines: 1,
                    point: [80, 63]
                }
            },
            flowers: {
                file: "Flowers_Backyard.png",
                frames: 2,
                frameDelay: 30,
                position: [112, 38],
                label: "Florcitas",
                command: {
                    cmd: "text",
                    txt: "Son muy lindas!",
                    align: "center",
                    lines: 1,
                    point: [108, 47]
                }
            },
            fox: {
                file: "Fox.png",
                frames: 2,
                frameDelay: 15,
                position: [13, 31],
                label: "Zorrito",
                command: {
                    cmd: "text",
                    txt: "*acaricias al zorrito*\nEs la mascota de Game On!",
                    align: "center",
                    lines: 2,
                    point: [25, 45]
                }
            },
            table: {
                file: "Drink_Table.png",
                frames: 1,
                position: [59, 84],
                label: "Barra de tragos"
            },
            pinkDrink: {
                file: "Drink_Pink.png",
                frames: 2,
                frameDelay: 30,
                position: [59, 69],
                label: "Trago Loco",
                command: {
                    cmd: "action",
                    actionId: "DrinkInteract"
                }
            },
            orangeDrink: {
                file: "Drink_Orange.png",
                frames: 2,
                frameDelay: 15,
                position: [71, 71],
                label: "Trago naranja",
                command: {
                    cmd: "action",
                    actionId: "GibberishInteracted"
                }
            },
            beer: {
                file: "Beer.png",
                frames: 2,
                frameDelay: 30,
                position: [65, 73],
                label: "Birra",
                command: {
                    cmd: "action",
                    actionId: "BeerInteract"
                }
            },
        },
        music: "patiomix.mp3",
        musicVolume: 0.75
    },

    entrada: {
        bg: "Room_Front.png",
        frames: 2,
        frameDelay: 30,
        avatarScale: 2,
        pageBg: "#663AB6",
        area: "entrada-colision.png",
        tint: "#E067B8",
        bubblesY: 45,
        spawn: [14, 84, 71, 92],
        areaColors: {
            //h will be replaced by #
            h00ff1b: {
                cmd: "enter",
                room: "hall",
                label: "Galería WIGAr",
                point: [100, 80],
                enterPoint: [45, 80],
                obstacle: false
            },
        }
    },

    hall: {
        bg: "Room_Hall-V01.png",
        frames: 2,
        frameDelay: 30,
        avatarScale: 2,
        pageBg: "#fae1f7",
        area: "Room_Hall-CollisionAreas-b-V01.png",
        tint: "#f7cada",
        bubblesY: 45,
        spawn: [21, 75, 105, 92],
        areaColors: {
            h1bff00: {
                cmd: "enter",
                room: "room1",
                label: "Sala 1",
                point: [35, 68],
                enterPoint: [90, 90],
                obstacle: false
            },
            hff00f2: {
                cmd: "enter",
                room: "room2",
                label: "Sala 2",
                point: [62, 68],
                enterPoint: [90, 90],
                obstacle: false
            },
            h560932: {
                cmd: "enter",
                room: "room3",
                label: "Sala 3",
                point: [90, 68],
                enterPoint: [90, 90],
                obstacle: false
            },
            hfdff13: {
                cmd: "enter",
                room: "patio",
                label: "Patio",
                point: [8, 78],
                enterPoint: [116, 69],
                obstacle: false
            },
            h1a00fb: {
                cmd: "enter",
                room: "entrada",
                label: "Afuera",
                point: [64, 97],
                enterPoint: [100, 90],
                obstacle: false
            }
        },
        things: {
            vase: {
                file: "FlowerVase.png",
                position: [84, 82],
                label: "Un arreglo floral que huele muy bien"
            },
            rabbit: {
                file: "Rabbit-1.png",
                frames: 2,
                frameDelay: 10,
                position: [11, 92],
                label: "Conejito <3",
                command: {
                    cmd: "text",
                    txt: "*Acaricias al conejito*\n*es MUY suave*",
                    align: "center",
                    lines: 2,
                    point: [16, 96]
                }
            },
            teaTable: {
                file: "Tea_Table.png",
                label: "Mesa de té",
                frames: 2,
                frameDelay: 30,
                position: [28, 86],
                command: {
                    cmd: "text",
                    txt: "*elegís un té*\n*tomás un té calentito*",
                    align: "center",
                    lines: 2,
                    point: [37, 98]
                }
            }
        },
        music: "cruisingalong.mp3",
        musicVolume: 0.5
    },

    room2: {
        bg: "Room-2_Base.png",
        frames: 2,
        frameDelay: 30,
        avatarScale: 2.9,
        pageBg: "#b3d9ee",
        area: "Room-2_CollisionArea.png",
        tint: "#edd97b",
        bubblesY: 45,
        spawn: [11, 77, 115, 92],
        areaColors: {
            h3ed924: {
                cmd: "enter",
                room: "hall",
                label: "Hall",
                point: [64, 97],
                enterPoint: [69, 76],
                obstacle: false
            },
            hb30d0d: {
                cmd: "text",
                txt: "No aclares que oscurece",
                align: "center",
                lines: 1,
                url: "https://myprofanity.itch.io/no-aclares-que-oscurece",
                label: "No aclares que oscurece",
                point: [25, 77],
                obstacle: true
            },
            hb30d9c: {
                cmd: "text",
                txt: "Sunite!",
                align: "center",
                lines: 1,
                url: "https://lefrancha.itch.io/sunite",
                label: "Sunite!",
                point: [43, 77],
                obstacle: true
            },
            h511348: {
                cmd: "text",
                txt: "Swap Season",
                align: "center",
                lines: 1,
                url: "https://giovannalopes.itch.io/swap-season",
                label: "Swap Season",
                point: [63, 77],
                obstacle: true
            },
            h511322: {
                cmd: "text",
                txt: "El viagé",
                align: "center",
                lines: 1,
                url: "https://valcadstor.itch.io/el-viage",
                label: "El viagé",
                point: [82, 77],
                obstacle: true
            },
            hd5bac1: {
                cmd: "text",
                txt: "Linked Witches",
                align: "center",
                lines: 1,
                url: "https://frammbu.itch.io/linked-witch",
                label: "Linked Witches",
                point: [103, 77],
                obstacle: true
            }
        },
        things: {
            cat: {
                file: "Cat_Name-Michi.png",
                frames: 2,
                frameDelay: 10,
                position: [116, 64],
                label: "Michi",
                command: {
                    cmd: "text",
                    txt: "prrrrrrrrrrrrrrrrrrrrrrrrrrrr :3",
                    align: "center",
                    lines: 1,
                    point: [110, 80]
                }
            }
        },
        music: "chillgaming.mp3"
    },

    room3: {
        bg: "Room-3_Base.png",
        frames: 2,
        frameDelay: 30,
        avatarScale: 2.9,
        pageBg: "#89d7ff",
        area: "Room-3_CollisionAreas.png",
        tint: "#ffbead",
        bubblesY: 45,
        spawn: [11, 77, 115, 92],
        areaColors: {
            hdd9a0b: {
                cmd: "enter",
                room: "hall",
                label: "Hall",
                point: [65, 97],
                enterPoint: [90, 76],
                obstacle: false
            },
            hfb67c3: {
                cmd: "text",
                txt: "¿Quieres ser mi Player 2?",
                align: "center",
                lines: 1,
                url: "https://deivid-deivis.itch.io/qp2",
                label: "¿Quieres ser mi Player 2?",
                point: [25, 78],
                obstacle: true
            },
            h6a3857: {
                cmd: "text",
                txt: "Together From Afar",
                align: "center",
                lines: 1,
                url: "https://mergrazzini.itch.io/together-from-afar",
                label: "Together From Afar",
                point: [45, 78],
                obstacle: true
            },
            h426a38: {
                cmd: "text",
                txt: "Sumi",
                align: "center",
                lines: 1,
                url: " https://magentawitch.itch.io/sumi",
                label: "Sumi",
                point: [63, 78],
                obstacle: true
            },
            hc7ffb8: {
                cmd: "text",
                txt: "Undark",
                align: "center",
                lines: 1,
                url: "https://the-glowing-girls.itch.io/undark",
                label: "Undark",
                point: [82, 78],
                obstacle: true
            },
            hffe8b8: {
                cmd: "text",
                txt: "MOKSHA",
                align: "center",
                lines: 1,
                url: "https://alfabuenamaravilla.itch.io/wgj-2020-wip",
                label: "MOKSHA",
                point: [100, 78],
                obstacle: true
            }
        },
        things: {
            cat: {
                file: "Cat_Name-Arcadia.png",
                frames: 2,
                frameDelay: 10,
                position: [115, 72],
                label: "Arcadia",
                command: {
                    cmd: "text",
                    txt: "miau :3",
                    align: "center",
                    lines: 1,
                    point: [112, 85]
                }
            },
            pig: {
                file: "Chanchi.png",
                frames: 2,
                frameDelay: 10,
                position: [0, 85],
                label: "Chanchi",
                command: {
                    cmd: "text",
                    txt: "DONACIONES\nSi te gustó la experiencia,\npodés invitarnos a un cafecito <3",
                    align: "center",
                    url: "https://cafecito.app/wigar",
                    lines: 3,
                    point: [20, 87]
                }
            }
        },
        music: "chillgaming.mp3",
        musicVolume: 0.5
    },

    room1: {
        bg: "Room-1_Base.png",
        frames: 2,
        frameDelay: 30,
        avatarScale: 2.9,
        pageBg: "#89d7ff",
        area: "Room-1_CollisionAreas.png",
        tint: "#ffbead",
        bubblesY: 45,
        spawn: [11, 77, 115, 92],
        areaColors: {
            h8e24d9: {
                cmd: "enter",
                room: "hall",
                label: "Hall",
                point: [67, 98],
                enterPoint: [25, 76],
                obstacle: false
            },
            h4c087b: {
                cmd: "text",
                txt: "Stellar Memories",
                align: "center",
                lines: 1,
                url: "https://kawzar.itch.io/stellar-memories",
                label: "Stellar Memories",
                point: [25, 75],
                obstacle: true
            },
            hc687f2: {
                cmd: "text",
                txt: "El eco de tu yo",
                align: "center",
                lines: 1,
                url: "https://risumortem.itch.io/el-eco-de-tu-yo",
                label: "El eco de tu yo",
                point: [44, 75],
                obstacle: true
            },
            h917e9d: {
                cmd: "text",
                txt: "Ana",
                align: "center",
                lines: 1,
                url: "https://restiur1.itch.io/ana-wgj",
                label: "Ana",
                point: [60, 75],
                obstacle: true
            },
            h1c072a: {
                cmd: "text",
                txt: "Chasqui",
                align: "center",
                lines: 1,
                url: "https://taniaolarte.itch.io/chasqui",
                label: "Chasqui",
                point: [80, 75],
                obstacle: true
            },
            h1b2a07: {
                cmd: "text",
                txt: "Hope Drowals",
                align: "center",
                lines: 1,
                url: "https://marialuzc.itch.io/hope-drawals",
                label: "Hope Drowals",
                point: [100, 75],
                obstacle: true
            }
        },
        things: {
            cat: {
                file: "Cat_Name-Solomon.png",
                frames: 2,
                frameDelay: 10,
                position: [115, 73],
                label: "Solomon",
                command: {
                    cmd: "text",
                    txt: "prr prr prr :3",
                    align: "center",
                    lines: 1,
                    point: [112, 85]
                }
            },
            bambi: {
                file: "Bambi.png",
                frames: 2,
                frameDelay: 10,
                position: [4, 81],
                label: "Bambi",
                command: {
                    cmd: "text",
                    txt: "El arte de esta galería es de\nLaura Palavecino\nVisitá su portfolio!",
                    align: "center",
                    url: "https://laurapalavecino.com/",
                    lines: 3,
                    point: [28, 90]
                }
            }
        },
        music: "chillgaming.mp3",
        musicVolume: 0.5
    }
};