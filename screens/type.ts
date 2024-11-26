export type RootStackParamList = {
    Tabs: undefined;
    Conceitos: { courseId: string }; // Tela para exibir os conceitos de uma disciplina
    DetalhesDisciplina: { course: any }; // Tela para exibir detalhes de uma disciplina
    
  }