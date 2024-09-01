
import noData from '../imgs/no data.gif'

const NoDataMessage=({message})=>{


    return(
        <div className="text-center flex flex-col items-center justify-center w-full p-4 overflow-hidden mt-4">
            <p className='w-full py-4 rounded-full bg-grey/50 mb-10'>{message}</p>
            <img src={noData} alt="" className='w-[200px] aspect-square rounded-full' />
        </div>
    )
}

export default NoDataMessage;