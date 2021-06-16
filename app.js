require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async () => {

    const busquedas = new Busquedas();
    let opt = 0;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const busqueda = await leerInput('Ciudad a buscar: ');

                //buscar los lugares
                const lugares = await busquedas.ciudades(busqueda);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;


                const lugarSel = lugares.find(l => l.id === id);
                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                //Clima
                const clima = await busquedas.climaPorLugar(lugarSel.lat, lugarSel.lng);

                //mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Clima actual:', clima.desc.green);

                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                // busquedas.historial.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })
                break;

        }
        if (opt !== 0) await pausa();

    } while (opt !== 0);
}

main();