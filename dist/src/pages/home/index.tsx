import { BsSearch } from 'react-icons/bs'
import style from './home.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, FormEvent, useEffect } from 'react'


 export interface CoinProps{
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    vwap24Hr: string;
    changePercent24Hr: string;
    rank: string;
    suppy: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    explore: string;
    formatedPrice?: string;
    formatedMarket?: string;
    formatedVolume?: string;
}

interface DataProps{
    data: CoinProps[]
}

export function Home(){

    const [input, setInput] = useState('')
    const [coins, setCoins] = useState<CoinProps[]>([])
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate();

    useEffect(()=>{
        getData();
    },[offset])

    async function getData(){
        fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
        .then(response => response.json())
        .then((data: DataProps) => {
            const coinsData = data.data; 

            const price = Intl.NumberFormat('en-US',{
                style:'currency',
                currency:'USD'
            })

            const priceCompact = Intl.NumberFormat('en-US',{
                style:'currency',
                currency:'USD',
                notation: 'compact'
            })

            const formatedResult = coinsData.map((item) => {
                const formated = {
                    ...item,
                    formatedPrice: price.format(Number(item.priceUsd)),

                    formatedMarket: priceCompact.format(Number(item.marketCapUsd)),

                    formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
                }

                return formated;
            })
            
            const listCoins = [...coins, ...formatedResult]
            setCoins(listCoins)


        })

    }

    function handleSubmit(e:FormEvent){
        e.preventDefault();

            if(input === '')return;
            navigate(`detail/${input}`)

    }  

    function handleGetMore(){
        if(offset === 0){
            setOffset(10);
            return;
        }

        setOffset( offset + 10)
    }


    return(
        <main className={style.container}>

            <form className={style.form} onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder='Digite o nome da moeda'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type='submit'> 
                     <BsSearch size={30} color=''/>
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope='col'>Moeda</th>
                        <th scope='col'>Valor Mercado</th>
                        <th scope='col'>Preço</th>
                        <th scope='col'>Volume</th>
                        <th scope='col'>Mudança 24H</th>
                    </tr>
                </thead>

                <tbody id='tbody'>

                    {coins.length > 0 && coins.map((item)=>(

                        <tr className={style.tr} key={item.id}>

                        <td className={style.tdLabel} data-label = 'Moeda'>
                            <div className={style.name}>

                                <img src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} className={style.logo} alt="LogoCripto" />

                                <Link to={`/detail/${item.id}`}>
                                <span>{item.name}</span>  | {item.symbol}
                                </Link>
                            </div>
                        </td>

                        <td className={style.tdLabel} data-label = 'Valor Mercado'>
                            {item.formatedMarket}
                        </td>

                        <td className={style.tdLabel} data-label = 'Preço'>
                            {item.formatedPrice}
                        </td>

                        <td className={style.tdLabel} data-label = 'Volume'>
                            {item.formatedVolume}
                        </td>

                        <td className={style.tdProfit} data-label = 'Mudança 24H'>
                            
                                <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                               
                        </td>


                        
                    </tr>

                    ))}

                </tbody>
            </table>

            <button className={style.buttonMore}onClick={handleGetMore} >
                Carregar mais...
            </button>

        </main>
    )
}