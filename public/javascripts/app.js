$(document).ready(function () {
    $(document).on('click', '#openList', function () {
        var that = $(this);
        var data = {listId: $('#favoriteList').find(":selected").attr("listId")};
        $.get("/favorite", data, function (list) {
            location.href = "/favorite?listId=" + list.listId;
        });
    });
});