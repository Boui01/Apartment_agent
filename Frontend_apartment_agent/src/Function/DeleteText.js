// Delete text in string such as "hello world" to "world" only delete "hello"
function DeleteText (text , del , replace) {
    const del_rule = new RegExp(del, 'g');
    text = text.replace( del_rule , replace );

    return text
}

export default DeleteText