var point_num = 0;
var real_point_array = [];

function ontablecell(i){
    point_num = i;
    cell = document.getElementsByClassName("cell-" + i)[0];
    tbody = document.getElementsByTagName("tbody")[0];
    var rows = [];
    rows = tbody.getElementsByTagName("tr");
    var index = 0;
    for( let row of rows ){
        if(index % 2 == 1){
            row.style.backgroundColor = "#f2f2f2";
        }
        else {
            row.style.backgroundColor = "#fff";
        }
        index++;
    }
    cell.style.backgroundColor = "yellow";
    cell.focus();
}

$(document).ready(function () {
    // Get the modal
    var modal = $('#modal');

    // Get the button that opens the modal
    var modalButton = $('#modalButton');

    // Get the <span> element that closes the modal
    var close = $('.close');

    // When the user clicks the button, open the modal 
    modalButton.click(function () {
        modal.show();
        document.getElementsByClassName("real-distance")[0].style.display = "flex";
    });

    // When the user clicks on <span> (x), close the modal
    close.click(function () {
        modal.hide();
    });

    var point_table = document.getElementById("points_table");
    
    function init_table(){
        var tr = "<tbody>"
        for(var i = 1; i <= 17; i++){
            if(i < 8){
                tr += "<tr class='cell-" + i + "'><td><a class='red-point' onclick='ontablecell(" + i + ");'>" + i + "<div></div></a></td><td>-</td><td>-</td><td>-</td></tr>";
            }
            else {
                tr += "<tr class='cell-" + i + "'><td><a class='red-point' onclick='ontablecell(" + i + ");'>-</a></td><td>-</td><td>-</td><td>-</td></tr>";
            }
            
        }
        tr += "</tbody>";
        point_table.innerHTML += tr;
    }

    init_table();

    

    // Get the dropdown menu
    var dropdownMenu = $('#dropdownMenu');

    // Get the dropdown button
    var dropdownButton = $('#dropdownButton');

    document.getElementById("importButton").addEventListener("click", function () {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.addEventListener("change", function (event) {
            file = event.target.files[0];
            load_img(file)
        });
        input.click();
    });

    function load_img(file) {
        var reader = new FileReader();

        reader.addEventListener("load", function () {
            var dataUrl = reader.result;
            var imgElement = document.createElement("img");
            imgElement.src = dataUrl;
            // document.getElementById("img_tag").innerHTML = '<div id="axio"><div class="x-axios"></div><div class="y-axios"></div></div>';
            document.getElementById("img_tag").appendChild(imgElement);
        });

        reader.readAsDataURL(file);
    }
    var scale_value = 1;
    var point_n = 0;
    var sphere_r = 1;
    var array_position = [];

    function init_array_position(){
        for(let i = 0; i <= 17; i++){
            var array_item = [0, 0];
            array_position.push(array_item);
        }
    }

    init_array_position();
    document.getElementById("axio").style.display = "none";

    var img_view = document.getElementById("img_tag");
    var axio = document.getElementById("axio");
    
    var img_view_width = img_view.offsetWidth;
    var img_view_height = img_view.offsetHeight;

    axio.style.top = "0px";
    axio.style.left = "0px";    
    function set_axio(x, y) {
        var num_x = parseInt(x.replace(/\D/g, ""));
        var num_y = parseInt(y.replace(/\D/g, ""));
        // console.log(num_x, num_y, img_view_height, img_view_width);
        // console.log(num_x - img_view_width, num_y - img_view_height)
        axio.style.left = (num_x - img_view_width) + "px";
        axio.style.top = (num_y - img_view_height) + "px";
    }

    document.getElementById("ok-btn").addEventListener("click", function(event){
        real_distance = $("input[name='real-distance']").val();
        document.getElementsByClassName("real-distance")[0].style.display = "none";
        scale_value = real_distance / 100;
        event.preventDefault();
        console.log(real_distance);
        $('#modal').hide();
        reset_point_xy();
    });

    document.getElementById("cancel-btn").addEventListener("click", function(event){
        document.getElementsByClassName("real-distance")[0].style.display = "none";
        $('#modal').hide();
    });

    function convert_axios(x, y, i){
        var first_point = document.getElementById("1p");
        var offset_x = first_point.style.top;
        var offset_y = first_point.style.left;
        offset_x = parseInt(offset_x.replace(/\D/g, ""));
        offset_y = parseInt(offset_y.replace(/\D/g, ""));
        var real_a = round_f(-(x - offset_x) * scale_value);
        var real_b = round_f((offset_y - y) * scale_value);
        // array_position[i][0] = real_a;
        // array_position[i][1] = real_b;
        var r = sphere_r;
        var real_x = real_a;
        var real_y = Math.sqrt(Math.abs(real_b*real_b - Math.pow((real_a*real_a + real_b*real_b), 2)/(4*r*r)));
        var real_z = -r + (real_a*real_a + real_b*real_b) / (2*r);

        return [real_x, real_y, real_z, real_a, real_b];
    }

    function round_f(number) {
        var decimalPlaces = 1;
        var roundedNumber = Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
        return roundedNumber;
    }

    function set_table_data(element){
        var element_id = element.id;
        x = element.style.top;
        y = element.style.left;
        z = "0";

        var element_row = document.getElementsByClassName("cell-" + parseInt(element_id.replace(/\D/g, "")))[0];
        cell_x = element_row.getElementsByTagName("td")[1];
        cell_y = element_row.getElementsByTagName("td")[2];
        cell_z = element_row.getElementsByTagName("td")[3];
        real_point = convert_axios(parseInt(x.replace(/\D/g, "")), parseInt(y.replace(/\D/g, "")), parseInt(element_id.replace(/\D/g, "")));
        
        cell_x.innerHTML = round_f(real_point[1]);
        cell_y.innerHTML = round_f(real_point[0]);
        cell_z.innerHTML = round_f(real_point[2]);

        array_position[element_id] = [real_point[3], real_point[4]];

        /////set point label
        if(parseInt(element_id.replace(/\D/g, "")) < 8){
            element.innerHTML = "<div class='point-label'><span>"+ parseInt(element_id.replace(/\D/g, "")) +"</span>("+ round_f(real_point[4]) + "," + round_f(real_point[3]) + ")</div>";
        }
        else{
            element.innerHTML = "<div class='point-label'>("+ round_f(real_point[4]) + "," + round_f(real_point[3]) + ")</div>";
        }
    }

    img_view.addEventListener("click", function (event) {
        if(point_num === 0){
            return;
        }
        if(point_n > 10){
            return;
        }

        if(document.getElementById(point_num + "p") != null){
            return;
        }
        point_n++;
        var childDiv = document.createElement("div");
        childDiv.className = "childDiv";
        childDiv.id = point_num + "p";
        childDiv.style.backgroundColor = "rgb(255, 120, 120)"
        childDiv.addEventListener("click",makeElementDraggable);
        this.appendChild(childDiv);
        var rect = this.getBoundingClientRect();
        var offsetX = event.clientX - rect.left;
        var offsetY = event.clientY - rect.top;
        
        childDiv.style.left = offsetX + "px";
        childDiv.style.top = offsetY + "px";
        if(point_n > 0){
            var firstpoint = document.getElementById("1p");
            var firstpoint_x = firstpoint.style.left;
            var firstpoint_y = firstpoint.style.top;
            set_axio(firstpoint_x, firstpoint_y);
            axio.style.display = "unset";
        }
        point_num = 0;
        set_table_data(childDiv);
    });

    $("input[name='radius']")[0].addEventListener("change", function() {
        sphere_r = $("input[name='radius']").val();
        console.log(sphere_r);
        reset_point_xy();
    });

    function makeElementDraggable(event){
        event.stopPropagation();
        element = event.target;
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = element.offsetTop - pos2 + "px";
            element.style.left = element.offsetLeft - pos1 + "px";
            if(element.id === "1p"){
                var firstpoint_x = element.style.left;
                var firstpoint_y = element.style.top;
                set_axio(firstpoint_x, firstpoint_y);
            }
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            if(event.target.id === "1p"){
                reset_point_xy();
                event.target.click();
            }
        }

        all_point = document.getElementsByClassName("childDiv");
        for(item of all_point){
            item.style.backgroundColor = "rgb(255, 120, 120)";
            if(item.id === element.id){
                element.style.backgroundColor = "red";
            }
        }
        set_table_data(element);
    };

    document.getElementById("create_opposite").addEventListener("click", function(){
        // console.log(array_position);
        set_data_table();
    });

    function set_data_table(){
        var all_point = []
        all_point = document.getElementsByClassName("childDiv");
        var first_point = document.getElementById("1p");
        // let point_array = all_point.slice(1);
        // console.log(all_point);
        // console.log(first_point);

        var elements = document.querySelectorAll('.childDiv1');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.parentNode.removeChild(element);
        }

        for(item of all_point){
            if($(item)[0].id === "1p"){
                continue;
            }
            item = $(item)[0];
            var point_x = item.style.left;
            var point_y = item.style.top;
            var first_x = first_point.style.left;
            
            var int_x = (parseInt(first_x.replace(/\D/g, "")) - parseInt(point_x.replace(/\D/g, ""))) * 2 + parseInt(point_x.replace(/\D/g, "")) + "px";
            var int_y = parseInt(point_y.replace(/\D/g, "")) + "px";
            console.log(int_x, int_y);

            var childDiv = document.createElement("div");
            childDiv.className = "childDiv1";
            childDiv.id = item.id + "p2";
            childDiv.style.backgroundColor = "rgb(255, 120, 120)"
            img_view.appendChild(childDiv);
            
            childDiv.style.left = int_x;
            childDiv.style.top = int_y;
        }
    }

    function reset_point_xy() {
        var elements = document.querySelectorAll('.childDiv');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.click();
        }
    }
    
    // When the user clicks the dropdown button, toggle the visibility of the dropdown menu
    dropdownButton.click(function () {
        dropdownMenu.toggle();
    });

    // Hide the dropdown menu when the user clicks outside of it
    $(window).click(function (event) {
        if (!event.target.matches('#dropdownButton')) {
            dropdownMenu.hide();
        }
    });

    // When the user clicks anywhere outside of the modal, close it
    $(window).click(function (event) {
        if (event.target == modal[0]) {
            modal.hide();
        }
    });
});