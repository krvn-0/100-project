
const DeleteProductHandler = async ( id, name ) => {
    try {
        const response = await fetch(`http://localhost:3001/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            alert(`Failed to delete product ${name}`);
            return null;
        }
        alert(`${name} deleted successfully`);
        return true;
    }   catch (error) {
        console.log('Error: ', error)
        return false;
    }
}

export default DeleteProductHandler;