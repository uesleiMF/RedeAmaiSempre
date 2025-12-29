import React, { Component } from "react";
import img from "../biblia.jpg";
import "./Frase.css";
class Frase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textoFrase: "",
    };
    this.palavraEdificante = this.palavraEdificante.bind(this);

    this.frases = [
      "Agora, pois, permanecem a fé, a esperança e o amor, estes três, mas o maior destes é o amor. 1 Coríntios 13:13 ",

      "Amor tudo sofre, tudo crê, tudo espera, tudo suporta, o amor jamais acaba. Corintios, 13 - 7 ",

      "Tenham amor, pois o amor une perfeitamente todas as coisas. O amor é o vínculo da perfeição. colossenses 3:14",

      "Assim, eles já não são dois, mas sim uma só carne. Portanto, o que Deus uniu, ninguém separe.Mateus 19:6",

      "Quem encontra uma esposa encontra algo excelente; recebeu uma bênção do Senhor.Provérbios 18:22",

      'Então o Senhor Deus declarou: "Não é bom que o homem esteja só; farei para ele alguém que o auxilie e lhe corresponda".Gênesis 2:18',

      "Maridos, ame cada um a sua mulher, assim como Cristo amou a igreja e entregou-se por ela.Efésios 5:25",

      "Mulheres, sujeite-se cada uma ao seu marido, como convém a quem está no Senhor. Maridos, cada um ame a sua mulher e não a tratem com amargura.Colossenses 3:18-19",

      "Toda mulher sábia edifica a sua casa, mas a tola a derruba com as próprias mãos.Provérbios 14:1",

      "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor. O amor não se alegra com a injustiça, mas se alegra com a verdade. Tudo sofre, tudo crê, tudo espera, tudo suporta.1 Coríntios 13:4-7",

      "As muitas águas não podem apagar este amor, nem os rios afogá-lo; ainda que alguém desse todos os bens de sua casa pelo amor, certamente o desprezariam.Cânticos 8:7",
    ];
  }

  palavraEdificante() {
    let state = this.state;

    let numeroAleatorio = Math.floor(Math.random() * this.frases.length);

    state.textoFrase = '" ' + this.frases[numeroAleatorio] + ' "';
    this.setState(state);
  }

  render() {
    return (
      <div className="container">
        <div className="card mt-4 mb-4 bg-warning bg-opacity-50">
         <p></p>
           <p className="mx-4 my-4 mb-0 text-center fs-2 fw-bold">
            {" "}
            PALAVRAS EDIFICANTES
          </p>
          <p className="mx-4 my-4 mb-0 text-center fs-3 fw-bold"> PARA SEU CASAMENTO</p>
          <p></p>


      
          <img className="img" src={img} alt="Palavras da Biblia" />



          <Botao nome="CLIQUE AQUI" acaoBtn={this.palavraEdificante} />

          <h3 className="textoFrase">{this.state.textoFrase}</h3>
        </div>
      </div>
    );
  }
}

class Botao extends Component {
  render() {
    return <button onClick={this.props.acaoBtn}>{this.props.nome}</button>;
  }
}
export default Frase;
