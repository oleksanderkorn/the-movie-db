$(document).ready(function () {
    $.get("/lists", function (lists) {
        return $.each(lists, function (i, list) {
                $('#favoriteList').append("<option value='" + i + "' listId='" + list.listId + "'>" + list.listName + "</option>");
            }
        );
    });

    $(document).on('click', '#openList', function () {
        var that = $(this);
        var data = {listId: $('#favoriteList').find(":selected").attr("listId")};
        $.get("/favorite", data, function (list) {
            sessionStorage.setItem("list", list);
            location.href = "/favorite?listId=" + list.listId;
        });
    });

    $(document).on('change', '#favoriteList', function () {
        $('.favorite-button-add').removeClass('favorite-button-remove');
    });

    $(document).on('click', '.favorite-button-add', function () {
        if($('#favoriteList').val() != null) {
            var that = $(this);
            var data = {
                title: that.next().html(),
                posterPath: that.next().next().attr("src"),
                listId: $('#favoriteList').find(":selected").attr("listId")
            };
            $.post("/movie", data);
            $(this).addClass('favorite-button-remove');
        } else {
            alert("Create a list first, please.");
        }
    });
});



