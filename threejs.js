import * as THREE from 'three';
import { spawn } from 'child_process';
import { os } from 'os';
import { path } from 'path';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';

function conv_num(str) {
    console.log(str);
    return (parseInt(str.replace(/\D/g, "")));
}

$(document).ready(function () {

    var view = document.getElementById("view_panel");

    var view_width = view.offsetWidth;
    var view_height = view.offsetHeight;

    var position = view.getBoundingClientRect();
    var point_pos_array = [];

    ///////////////////
    let group, camera, scene, renderer, exporter;

    init();
    animate();
    // render();
    function init() {

        scene = new THREE.Scene();

        scene.background = new THREE.Color(0x254855);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(view_width, view_height);
        view.appendChild(renderer.domElement);

        // camera

        camera = new THREE.PerspectiveCamera(40, view_width / view_height, 1, 1000);
        camera.position.set(30, 40, 60);
        scene.add(camera);

        // controls

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 5;
        controls.maxDistance = 100;


        // controls.maxPolarAngle = Math.PI / 2;

        // ambient light

        scene.add(new THREE.AmbientLight(0x666666));

        // point light

        const light = new THREE.PointLight(0xffffff, 3, 0, 0);
        camera.add(light);

        // helper

        scene.add(new THREE.AxesHelper(40));

        ///////////

        document.getElementById("import_stl_btn").addEventListener("click", function () {
            var input = document.createElement("input");
            input.type = "file";
            input.addEventListener("change", function (event) {
                var file = event.target.files[0];
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                import_stl(fileURL);
            });
            input.click();
            console.log("fileload");
        });

        document.getElementById("obj_rotate_x").addEventListener("change", function (event) {
            var rotate = event.target.value;
            var object = scene.getObjectByName("tooth_model");
            object.rotation.x = conv_degree(rotate);
            console.log(rotate);
        });

        document.getElementById("obj_rotate_y").addEventListener("change", function (event) {
            var rotate = event.target.value;
            var object = scene.getObjectByName("tooth_model");
            object.rotation.z = conv_degree(rotate);
            console.log(rotate);
        });

        document.getElementById("obj_rotate_z").addEventListener("change", function (event) {
            var rotate = event.target.value;
            var object = scene.getObjectByName("tooth_model");
            object.rotation.y = conv_degree(rotate);
            console.log(rotate);
        });

        function import_stl(stl_file) {

            const loader = new STLLoader();
          
            const material = new THREE.MeshPhongMaterial({ color: 0xd5d5d5, specular: 0x494949, shininess: 200 });

            loader.load(stl_file, function (geometry) {

                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.set(0, 0, 0);
                mesh.rotation.set(0, 0, 0);
                mesh.scale.set(0.15, 0.15, 0.15);

                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.name = "tooth_model";
                scene.add(mesh);
            });
        }

        function conv_degree(degree) {
            var radians = degree * (Math.PI / 180);
            console.log(radians);
            return radians;
        }


        function set_camera_rotation(x, y, z, degree) {
            var axis = new THREE.Vector3(x, y, z).normalize();
            var angle = conv_degree(degree);
            camera.rotateOnAxis(axis, angle);
        }
        // textures



        group = new THREE.Group();
        scene.add(group);
        document.getElementById("create_sphere").addEventListener("click", function () {
            var sphere_r = $("input[name='radius']").val();
            if (sphere_r === "") {
                return;
            }
            if (scene.getObjectByName("sphere")) {
                var sphere = scene.getObjectByName("sphere");
                if (sphere.visible) {
                    sphere.visible = false;
                }
                else if (sphere.geometry.parameters.radius !== sphere_r) {
                    scene.remove(sphere);
                    create_sphere(sphere_r);
                }
                else {
                    sphere.visible = true;
                }
            }
            else {
                create_sphere(sphere_r);
            }

        });

        function create_sphere(r) {
            var sphere_geometry = new THREE.SphereGeometry(r / 10, 50, 50);
            var sphere_material = new THREE.MeshPhongMaterial({
                color: 0x00ff00, // Green color
                opacity: 0.5, // Set the opacity value between 0 and 1
                transparent: true,
                shininess: 100 // Adjust the shininess for desired effect
            });

            var sphere = new THREE.Mesh(sphere_geometry, sphere_material);
            sphere.name = "sphere";
            sphere.position.set(0, 0, 0);
            scene.add(sphere);
        }

        // Set up mouse variables
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        // Add event listener for mouse click
        // view.addEventListener('click', onMouseClick, false);

        // Set up mouse variables
        var mouseDown = false;
        var mouseX = 0;
        var mouseY = 0;

        var view_type = "xy";

        document.getElementById("xy_view").addEventListener("click", function () {
            camera.position.set(0, 80, 0);
            camera.rotation.set(conv_degree(90), conv_degree(180), conv_degree(0));
            view_type = "xy";
        });

        document.getElementById("yz_view").addEventListener("click", function () {
            camera.position.set(80, 0, 0);
            camera.rotation.set(conv_degree(0), conv_degree(90), conv_degree(0));
            view_type = "yz";
        });

        document.getElementById("xz_view").addEventListener("click", function () {
            camera.position.set(0, 0, -80);
            camera.rotation.set(conv_degree(180), conv_degree(0), conv_degree(180));
            view_type = "xz";
        });

        document.getElementById("show_point").addEventListener("click", function () {
            var cell_data_array = $("tr[class^='cell-']");
            var t_i = 0;

            for (let item of cell_data_array) {
                t_i++;
                var cell_data = item.children;
                if (cell_data[1].innerHTML !== "-") {
                    var point_pos = [t_i, parseFloat(cell_data[1].innerHTML), parseFloat(cell_data[2].innerHTML), parseFloat(cell_data[3].innerHTML)];
                    point_pos_array.push(point_pos);
                }
            }

            for (let item of point_pos_array) {
                add_point(item);
            }
        });

        function add_point(item) {
            if (scene.getObjectByName(String("point_" + item[0]))) {
                scene.remove(scene.getObjectByName("point_" + item[0]));
            }
            if (scene.getObjectByName(String("point_l_" + item[0]))) {
                scene.remove(scene.getObjectByName(String("point_l_" + item[0])));
            }

            var point_geometry = new THREE.SphereGeometry(0.2, 20, 20);
            var point_material = new THREE.MeshPhongMaterial({
                color: 0xff0000, // Green color
                // opacity: 0.5, // Set the opacity value between 0 and 1
                // transparent: true,
                // shininess: 100 // Adjust the shininess for desired effect
            });
            var point = new THREE.Mesh(point_geometry, point_material);
            point.name = "point_" + item[0];
            point.position.set(item[1] / 10, item[3] / 10, item[2] / 10);
            scene.add(point);

            var point_l = new THREE.Mesh(point_geometry, point_material);
            point_l.name = "point_l_" + item[0];
            point_l.position.set(- item[1] / 10, item[3] / 10, item[2] / 10);

            scene.add(point_l);
        }

        // Add event listeners for mouse events
        view.addEventListener('mousedown', onMouseDown, false);
        view.addEventListener('mouseup', onMouseUp, false);
        view.addEventListener('mousemove', onMouseMove, false);

        var select_obj = "";

        // Functions to handle mouse events
        function onMouseDown(event) {
            // Calculate normalized device coordinates (-1 to +1)
            mouse.x = ((event.clientX - position.left) / view_width) * 2 - 1;
            mouse.y = -((event.clientY - position.top) / view_height) * 2 + 1;
            // console.log(mouse.x, mouse.y, event.clientX - position.left, event.clientY - position.top)

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Find all intersected objects
            var intersects = raycaster.intersectObjects(scene.children, true);

            // Check if any objects are intersected
            if (intersects.length > 0) {
                // Select the first intersected object
                var selectedObject = intersects;


                console.log('Selected object:', selectedObject);
                console.log(camera.position);
                console.log(camera.rotation);
                for (let obj_item of selectedObject) {
                    if (obj_item.object.name === "tooth_model") {
                        mouseDown = true;
                        controls.enabled = false;
                        select_obj = obj_item.object;
                        break;
                    }
                }
            }
            mouseX = event.clientX;
            mouseY = event.clientY;
        }

        function onMouseUp(event) {
            mouseDown = false;
            controls.enabled = true;
            select_obj = "";

        }

        function onMouseMove(event) {
            if (!mouseDown) return;

            // Calculate the change in mouse position
            var deltaX = event.clientX - mouseX;
            var deltaY = event.clientY - mouseY;

            // console.log(event.clientX, event.clientY, deltaX, deltaY);

            // Update the position of the cube based on mouse movement
            if (view_type == "xy") {
                select_obj.position.x -= deltaX * 0.03;
                select_obj.position.z -= deltaY * 0.03;
            }
            else if (view_type == "yz") {
                select_obj.position.z -= deltaX * 0.03;
                select_obj.position.y -= deltaY * 0.03;
            }
            else if (view_type == "xz") {
                select_obj.position.x -= deltaX * 0.03;
                select_obj.position.y -= deltaY * 0.03;
            }

            // Update the mouse position
            mouseX = event.clientX;
            mouseY = event.clientY;
        }

        window.addEventListener('resize', onWindowResize);

        // drawline();

        $("input[name='thita']")[0].addEventListener("change", function () {
            console.log($("input[name='thita']")[0]);
            if ($("input[name='radius']").val() !== "" && $("input[name='thita']").val() !== "") {
                console.log("draw line");
                drawline();
            }
        });

        function drawline() {

            if (scene.getObjectByName("line")) {
                scene.remove(scene.getObjectByName("line"));
            }

            const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
            const points = [];
            var sphere_r = $("input[name='radius']").val() / 10;
            var thita = $("input[name='thita']").val();

            var y = -5;
            var z = - (1 / Math.tan(thita * Math.PI / 180)) * y - sphere_r;
            var x = 0;

            points.push(new THREE.Vector3(0, - sphere_r, 0));
            points.push(new THREE.Vector3(x, z, y));

            // points.push( new THREE.Vector3( 10, 0, 0 ) );

            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            const line = new THREE.Line(geometry, material);

            line.name = "line";
            scene.add(line);

        }

    }

    //////////////

    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    exporter = new STLExporter();

    function exportBinary() {
        const now = new Date();

        let append_str = now.getMonth() + 1 + "_" + now.getDate() + "_" + now.getHours() + "_" + now.getMinutes() + "_" + now.getSeconds();
        const result = exporter.parse(scene.getObjectByName("sphere"), { binary: true });
        saveArrayBuffer(result, 'sphere_' + append_str +'.stl');

        setTimeout(function() {
            const result1 = exporter.parse(scene.getObjectByName("tooth_model"), { binary: true });
            saveArrayBuffer(result1, 'tooth_model_' + append_str + '.stl');
        }, 2000);

    }
    
    const link_down = document.createElement( 'a' );
    link_down.style.display = 'none';
    document.body.appendChild( link_down );

    function save( blob, filename ) {

        link_down.href = URL.createObjectURL( blob );
        link_down.download = filename;
        link_down.click();

    }

    function saveArrayBuffer(buffer, filename) {

        save(new Blob([buffer], { type: 'application/octet-stream' }), filename);

    }

    document.getElementById("export_stl_btn").addEventListener("click", function () {
        // create_model();

        exportBinary();
    });

    /////////////

    function onWindowResize() {

        camera.aspect = view_width / view_height;
        camera.updateProjectionMatrix();

        renderer.setSize(view_width, view_height);

    }

    function animate() {

        requestAnimationFrame(animate);
        // group.rotation.y += 0.005;
        render();

    }

    function render() {
        renderer.render(scene, camera);
    }

    function get_download_folder(){
        let downloadFolderPath;
        switch (os.platform()) {
        case 'win32':
            downloadFolderPath = path.join(os.homedir(), 'Downloads');
            break;
        case 'darwin':
            downloadFolderPath = path.join(os.homedir(), 'Downloads');
            break;
        case 'linux':
            downloadFolderPath = path.join(os.homedir(), 'Downloads');
            break;
        default:
            console.error('Unsupported operating system.');
            return;
        }

        console.log('Standard download folder:', downloadFolderPath);
    }

    get_download_folder();

    function run_app(){
        
        exec('tooth_app.exe', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        });

    }

});