
const getFarms = async () => {
    try {
        const response = await fetch('/farms')
        const json = await response.json()
        return json
    } catch (e) {
        return console.log(e)
    }
}

const getFarmPonds = async (id) => {
    try {
        const response = await fetch(`/farms/${id}/ponds`)
        const json = await response.json()
        return json
    } catch (e) {
        return console.log(e)
    }
}

const deleteFarm = (farmId) => {
    $.ajax({
        type: "DELETE",
        url: `/farms/${farmId}`,
        success: function(farm){
            alert(`Deleted Farm: ${farm.name}`);
        }
    });

    location.reload()
}

const newFarmRow = (id, name, size = 0, numberOfPonds = 0) => {
    $('#farm-table').append(`<tr id='${id}'>
                                <td>${name}</td>
                                <td>${size}</td>
                                <td>${numberOfPonds}</td>
                                <td><a href="/farms/edit/${id}">Link</td>
                                <td class='delete' onclick=deleteFarm('${id}')>X</td>
                             </tr>`)
}

$(document).ready(function(){

    //Populate Farm table
    getFarms().then((farms) => {
        $.each(farms, (i, farm) => {
            getFarmPonds(farm._id).then((farmPonds) => {
                newFarmRow(farm._id, farm.name, farmPonds.farmSize, farm.ponds.length)
            })
        })
    })

    // Create new farm
    $('#new-farm').submit((e) => {
        e.preventDefault()

        const name = $("input").val()

        $.ajax({
            type: 'POST',
            url: '/farms',
            data: JSON.stringify({name}),
            contentType: "application/json",
            dataType: 'json',
            success: (farm) => newFarmRow(farm._id, farm.name),
            error: (e) => console.log(e)
        });
    })
  
});