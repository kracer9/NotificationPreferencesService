export default interface EvaluateResponseDTO {
    decision: 'allow' | 'deny';
    reason?: string;
};
