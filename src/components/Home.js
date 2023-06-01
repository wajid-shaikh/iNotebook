// import AddNote from './AddNote';
import Notes from './Notes';

const Home = (props) => {
    const {showAlert} = props
    return (
        // <div style={{ 'backgroundColor': '#18A558' }}>
        <div>
            <Notes showAlert={showAlert}/>
        </div>
    )
}

export default Home
