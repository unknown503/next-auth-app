export const deleteUserEndpoint = async (id: string): Promise<any> => {
    const res = await fetch('api/delete', {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const jsonRes = await res.json()
    return jsonRes
}