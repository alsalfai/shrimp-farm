
const getFarmPonds = async (id) => {
    try {
        const response = await fetch(`/farms/${id}/ponds`)
        const json = await response.json()
        return json
    } catch (e) {
        return console.log(e)
    }
}

const deletePond = (pondId) => {
    $.ajax({
        type: "DELETE",
        url: `/ponds/${pondId}`,
        success: function(pond){
            alert(`Deleted Pond: ${pond.name}`);
        }
    });

    location.reload()
}

const newPondRow = (id, name, size = 0) => {
    $('#pond-table').append(`<tr id='${id}'>
                                <td>${name}</td>
                                <td>${size}</td>
                                <td><a href="/ponds/edit/${id}">Link</td>
                                <td class='delete'><a onclick=deletePond('${id}')>X</td>
                             </tr>`)
}

const url = window.location.href
const farmId = url.split("edit/")[1]

$(document).ready(function(){

    // Populate Pond table
    getFarmPonds(farmId).then((farm) => {
        $.each(farm.ponds, (i, pond) => {
            newPondRow(pond._id, pond.name, pond.size)
            $('#farm').append(`<div class='pond' title='${pond.name}' style="width:${pond.size*10}px;height:${pond.size*10}px" />`)
        })
    })

    // Edit farm
    $('#edit-farm').submit((e) => {
        e.preventDefault()

        const name = $("#edit-farm input").val()

        $.ajax({
            type: 'PATCH',
            url: `/farms/${farmId}`,
            data: JSON.stringify({name}),
            contentType: "application/json",
            dataType: 'json',
            success: (farm) => alert(`Succesfully updated farm name to ${farm.name}!`),
            error: (e) => console.log(e)
        });
    })

    // Add pond
    $('#add-pond').submit((e) => {
        e.preventDefault()

        const name = $("#add-pond input[name='name']").val()
        const size = $("#add-pond input[name='size']").val()

        $.ajax({
            type: 'POST',
            url: `/ponds`,
            data: JSON.stringify({name, size, farm: farmId}),
            contentType: "application/json",
            dataType: 'json',
            success: (pond) => {
                newPondRow(pond._id, pond.name, pond.size)
                location.reload()
            },
            error: (e) => console.log(e)
        });
    })
  
});