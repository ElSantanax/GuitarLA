import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"

export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MIN_ITEM = 1
    const MAX_ITEM = 5

    // Almacenar de manera local
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item) {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_ITEM) return
            const updateCart = [...cart]
            updateCart[itemExists].quantity++
            setCart(updateCart)
        } else {
            item.quantity = 1
            setCart([...cart, item])
        }
    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    // decrementar la cantiad de guitaras
    function decrementQuantity(id) {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEM) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updateCart)
    }

    // Incrementar la cantidad de guitaras que se puden comprar
    function increaseQuantity(id) {
        const updateCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEM) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updateCart)
    }

    //Borrar carrito de compras
    function clearCart() {
        setCart([])
    }

    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0))

    return {
        initialCart,
        data,
        cart,
        addToCart,
        removeFromCart,
        decrementQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}