
const url = window.location.href
const pondId = url.split("edit/")[1]

$(document).ready(function(){

    // Edit pond
    $('#edit-pond').submit((e) => {
        e.preventDefault()

        const name = $("input[name='name']").val()
        const size = $("input[name='size']").val()

        $.ajax({
            type: 'PATCH',
            url: `/ponds/${pondId}`,
            data: JSON.stringify({name, size}),
            contentType: "application/json",
            dataType: 'json',
            success: () => alert("Update succesful!"),
            error: (e) => console.log(e)
        });
    })
  
});