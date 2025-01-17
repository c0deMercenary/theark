'use client'
import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Moralis from 'moralis';
import { useFetch } from '@/components/Hooks/useFetch';
import Loading from '@/components/Loading';

const backendurl = process.env.NEXT_PUBLIC_API_URL;
console.log(`${backendurl}/wallets/`)

export default function Home() {
    const [transactions, setTransactions] = useState([]);
    const { data, isLoading } = useFetch(`${backendurl}/wallets/`);

    const addresses = data?.map((item) => item.address);
  

    useEffect(() => {
        const fetchTransactions = async () => {
            try {

                Moralis.start({
                    apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
                });
                if (addresses) {
                    const transactionsPromises = addresses.map(async (address) => {
                        const activeChains = await Moralis.EvmApi?.transaction.getWalletTransactions({ address });
                        return { address, activeChains };
                    });

                    const transactionsData = await Promise.all(transactionsPromises);
                    setTransactions(transactionsData);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchTransactions();
    }, [addresses]);

    if (isLoading) {
        return <Loading />
    }
    return (
        <main>
            <div className=" text-black">
                <figure className="p-[1rem]">
                    <p className="text-black md:text-4xl text-2xl font-bold">Dashboard</p>

                    <h2 className="text-black md:text-2xl font-bold my-[1rem]">Transactions</h2>
                    <p className='text-sm'>Last 7 days biggest transactions, gain valuable insights into trends, key clients, and overall financial health, empowering informed decision-making and strategic planning. Dive into the data and unlock actionable intelligence.</p>
                    <DataTable file={transactions} />
                </figure>
            </div>
        </main>
    );
}
