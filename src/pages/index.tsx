import type { NextPage } from 'next'
import { Title } from '../components/Layout'

const Home: NextPage = () => {

	return (
		<div className="flex h-[80vh]">
			<div className="m-auto">
				<h3 className='prose text-4xl'>{Title}</h3>
			</div>
		</div>
	)
}

export default Home
