import React from 'react'


class Card extends React.Component {
 
    render() {
        return(
            <div class="card mb-3">
               <h3 class="card-header">{this.props.title}</h3>

               <div class="card-body">
                  
                  {this.props.children}


               </div>
            </div>

        )
    }

}

export default Card